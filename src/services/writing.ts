import { pipe } from '@fxts/core';
import mongoose from 'mongoose';
import { ERROR } from '../constants/error.js';
import { BlockRepository } from '../types/block.js';
import { StateQuery } from '../types/express.js';
import { UserRepository } from '../types/user.js';
import {
  UpdateQuery,
  WritingDocument,
  WritingRepository,
  WritingResponse,
} from '../types/writing.js';
import catchError from '../utils/catchError.js';
import { useFailState, useSuccessState } from '../utils/state.js';

export interface IWritingService {
  getByUserIdAndState: (
    userId: string,
    state: StateQuery
  ) => Promise<ResultState<WritingDocument[]>>;
  create: (userId: string) => Promise<ResultState<WritingResponse>>;
  remove: (userId: string, writingId: string) => Promise<void | BadState>;
  update: (
    writingId: string,
    query: UpdateQuery
  ) => Promise<ResultState<WritingResponse>>;
}

class WritingService implements IWritingService {
  constructor(
    private readonly writingModel: WritingRepository,
    private readonly userModel: UserRepository,
    private readonly blockModel: BlockRepository
  ) {}

  getByUserIdAndState = async (
    userId: string,
    state: StateQuery
  ): Promise<ResultState<WritingDocument[]>> => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    const id = mongoose.Types.ObjectId(userId);
    const result = await pipe(
      this.getWritings.bind(this, id, state),
      catchError
    );

    return result;
  };

  private getWritings = async (
    id: mongoose.Types.ObjectId,
    state: StateQuery
  ) => {
    const writings: WritingDocument[] = await this.findByUserIdAndState(
      id,
      state
    );

    return useSuccessState(writings);
  };

  private findByUserIdAndState = async (
    userId: mongoose.Types.ObjectId,
    state: StateQuery
  ): Promise<WritingDocument[]> => {
    let result: WritingDocument[];
    switch (state) {
      case 'done': {
        result = await this.writingModel.findDoneByUserId(userId);
        return result;
      }

      case 'editing': {
        result = await this.writingModel.findEditingByUserId(userId);
        return result;
      }

      default: {
        result = await this.writingModel.findAllByUserId(userId);
        return result;
      }
    }
  };

  create = async (userId: string): Promise<ResultState<WritingResponse>> => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    const id = mongoose.Types.ObjectId(userId);
    const result = await pipe(this.createNewWriting.bind(this, id), catchError);

    return result;
  };

  private createNewWriting = async (
    userId: mongoose.Types.ObjectId
  ): Promise<ResultState<WritingResponse>> => {
    const initial = {
      isDone: false,
      author: userId,
      title: 'Untitled',
      blocks: [],
    };
    const newWriting: WritingDocument = await this.writingModel.create(initial);
    this.userModel.addWriting(userId, newWriting._id);

    return useSuccessState({
      writingId: newWriting._id,
      isDone: false,
      title: 'Untitled',
      blocks: [],
    });
  };

  remove = async (
    userId: string,
    writingId: string
  ): Promise<void | BadState> => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    if (!mongoose.isValidObjectId(writingId)) {
      return useFailState(ERROR.INVALID_WRITING_ID, 400);
    }

    const result = await pipe(
      this.removeWriting.bind(this, userId, writingId),
      catchError
    );

    return result;
  };

  private removeWriting = async (
    userId: string,
    writingId: string
  ): Promise<void> => {
    this.userModel.deleteWriting(userId, writingId);
    const blockIds: mongoose.Types.ObjectId[] =
      await this.writingModel.deleteById(writingId);
    this.blockModel.deleteByIds(blockIds);
  };

  update = async (
    writingId: string,
    query: UpdateQuery
  ): Promise<ResultState<WritingResponse>> => {
    if (!mongoose.isValidObjectId(writingId)) {
      return useFailState(ERROR.INVALID_WRITING_ID, 400);
    }

    const result = await pipe(
      this.updateWriting.bind(this, writingId, query),
      catchError
    );

    return result;
  };

  private updateWriting = async (
    writingId: string,
    query: UpdateQuery
  ): Promise<ResultState<WritingResponse>> => {
    const updated: WritingDocument = await this.writingModel.updateById(
      writingId,
      query
    );
    const { _id, isDone, title, blocks } = updated;

    return useSuccessState({
      writingId: _id,
      isDone,
      title,
      blocks,
    });
  };
}

export default WritingService;
