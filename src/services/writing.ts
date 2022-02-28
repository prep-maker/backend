import mongoose from 'mongoose';
import { ERROR } from '../constants/error.js';
import { StateQuery } from '../types/express.js';
import { WritingModel, WritingSchema } from '../types/writing.js';
import {
  createErrorState,
  createFailState,
  createSuccessState,
} from '../utils/state.js';

export interface IWritingService {
  getByUserId: (
    userId: string,
    state: StateQuery
  ) => Promise<ResultState<WritingSchema[]>>;
}

class WritingService implements IWritingService {
  constructor(private readonly writingModel: WritingModel) {}

  getByUserId = async (
    userId: string,
    state: StateQuery
  ): Promise<ResultState<WritingSchema[]>> => {
    if (!mongoose.isValidObjectId(userId)) {
      return createFailState(ERROR.INVALID_ID, 400);
    }

    const id = mongoose.Types.ObjectId(userId);

    try {
      const writings = await this.findWritingsByUserId(id, state);

      return createSuccessState(writings);
    } catch (error) {
      return createErrorState(error as Error);
    }
  };

  private findWritingsByUserId = async (
    userId: mongoose.Types.ObjectId,
    state: StateQuery
  ): Promise<WritingSchema[]> => {
    let result: WritingSchema[];
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
