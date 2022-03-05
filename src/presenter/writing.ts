import { pipe } from '@fxts/core';
import mongoose from 'mongoose';
import { ERROR } from '../common/constants/error.js';
import { BlockRepository } from '../common/types/block.js';
import { StateQuery } from '../common/types/express.js';
import { UserRepository } from '../common/types/user.js';
import {
  UpdateQuery,
  WritingRepository,
  WritingResponse,
} from '../common/types/writing.js';
import catchError from '../common/utils/catchError.js';
import { useFailState } from '../common/utils/state.js';
import WritingService, { IWritingService } from '../services/writing.js';

type WritingResult = Promise<ResultState<WritingResponse>>;
type WritingListResult = Promise<ResultState<WritingResponse[]>>;

export interface IWritingPresenter {
  getByUserIdAndState: (userId: string, state: StateQuery) => WritingListResult;
  create: (userId: string) => WritingResult;
  remove: (userId: string, writingId: string) => Promise<void | BadState>;
  update: (writingId: string, query: UpdateQuery) => WritingResult;
}

class WritingPresenter implements IWritingPresenter {
  private readonly writingService: IWritingService;

  constructor(
    private readonly writingModel: WritingRepository,
    private readonly userModel: UserRepository,
    private readonly blockModel: BlockRepository,
    private readonly WritingService: new (
      writingModel: WritingRepository,
      userModel: UserRepository,
      blockModel: BlockRepository
    ) => WritingService
  ) {
    this.writingService = new this.WritingService(
      this.writingModel,
      this.userModel,
      this.blockModel
    );
  }

  getByUserIdAndState = async (
    userId: string,
    state: StateQuery
  ): WritingListResult => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    const result = await pipe(
      this.writingService.getByUserIdAndState.bind(this, userId, state),
      catchError
    );

    return result;
  };

  create = async (userId: string): WritingResult => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    const id = mongoose.Types.ObjectId(userId);
    const result = await pipe(
      this.writingService.create.bind(this, id),
      catchError
    );

    return result;
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
      this.writingService.remove.bind(this, userId, writingId),
      catchError
    );

    return result;
  };

  update = async (writingId: string, query: UpdateQuery): WritingResult => {
    if (!mongoose.isValidObjectId(writingId)) {
      return useFailState(ERROR.INVALID_WRITING_ID, 400);
    }

    const result = await pipe(
      this.writingService.update.bind(this, writingId, query),
      catchError
    );

    return result;
  };
}

export default WritingPresenter;
