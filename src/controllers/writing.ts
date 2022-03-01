import { NextFunction, Response } from 'express';
import { IWritingService } from '../services/writing.js';
import { StateQuery, TypedRequestQueryAndParams } from '../types/express.js';
import { WritingSchema } from '../types/writing.js';

interface IWritingController {
  getWritings: (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, { userId: string }>,
    res: Response,
    next: NextFunction
  ) => void;
}

class WritingController implements IWritingController {
  constructor(private readonly writingService: IWritingService) {}
  getWritings = async (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, { userId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.userId;
    const state: StateQuery = req.query.state;
    const result: ResultState<WritingSchema[]> =
      await this.writingService.getByUserIdAndState(userId, state);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };
}

export default WritingController;
