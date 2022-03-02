import mongoose from 'mongoose';
import { ERROR } from '../constants/error.js';
import { BlockRepository } from '../types/block.js';
import { StateQuery } from '../types/express.js';
import { UserRepository } from '../types/user.js';
import {
  WritingDocument,
  WritingRepository,
  WritingResponse,
} from '../types/writing.js';
import {
  useErrorState,
  useFailState,
  useSuccessState,
} from '../utils/state.js';

export interface IWritingService {
  getByUserIdAndState: (
    userId: string,
    state: StateQuery
  ) => Promise<ResultState<WritingDocument[]>>;
  create: (userId: string) => Promise<ResultState<WritingResponse>>;
  remove: (userId: string, writingId: string) => Promise<void | BadState>;
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

    try {
      const writings: WritingDocument[] = await this.findByUserIdAndState(
        id,
        state
      );
      return useSuccessState(writings);
    } catch (error) {
      return useErrorState(error as Error);
    }
  };

  create = async (userId: string): Promise<ResultState<WritingResponse>> => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    const id = mongoose.Types.ObjectId(userId);

    try {
      const newWriting: WritingDocument = await this.writingModel.create({
        isDone: false,
        author: id,
        title: 'Untitled',
        blocks: [],
      });
      this.userModel.addWriting(id, newWriting._id);

      return useSuccessState({
        writingId: newWriting._id,
        isDone: false,
        title: 'Untitled',
        blocks: [],
      });
    } catch (error) {
      return useErrorState(error as Error);
    }
  };

  remove = async (
    userId: string,
    writingId: string
  ): Promise<void | BadState> => {
    if (
      !(mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(writingId))
    ) {
      return useFailState(ERROR.INVALID_USER_ID, 400);
    }

    try {
      this.userModel.deleteWriting(userId, writingId);
      const blockIds: mongoose.Types.ObjectId[] =
        await this.writingModel.deleteById(writingId);
      console.log(blockIds);
      this.blockModel.deleteByIds(blockIds);
    } catch (error) {
      return useErrorState(error as Error);
    }
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
}

export default WritingService;
