import mongoose from 'mongoose';
import { ERROR } from '../constants/error.js';
import { StateQuery } from '../types/express.js';
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
}

class WritingService implements IWritingService {
  constructor(private readonly writingModel: WritingRepository) {}

  getByUserIdAndState = async (
    userId: string,
    state: StateQuery
  ): Promise<ResultState<WritingDocument[]>> => {
    if (!mongoose.isValidObjectId(userId)) {
      return useFailState(ERROR.INVALID_ID, 400);
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
      return useFailState(ERROR.INVALID_ID, 400);
    }

    const id = mongoose.Types.ObjectId(userId);
    const newWriting: WritingDocument = await this.writingModel.create({
      isDone: false,
      author: id,
      title: 'Untitled',
      blocks: [],
    });

    return useSuccessState({
      writingId: newWriting._id,
      isDone: false,
      title: 'Untitled',
      blocks: [],
    });
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
