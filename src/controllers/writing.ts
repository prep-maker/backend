import { NextFunction, Response } from 'express';
import { IWritingService } from '../services/writing.js';
import { StateQuery, TypedRequestQuery } from '../types/express.js';
import { WritingSchema } from '../types/writing.js';

interface IWritingController {
  getWritings: (
    req: TypedRequestQuery<{ state: StateQuery }, { userId: string }>,
    res: Response,
    next: NextFunction
  ) => void;
}

class WritingController implements IWritingController {
  constructor(private readonly writingService: IWritingService) {}
  getWritings = async (
    req: TypedRequestQuery<{ state: StateQuery }, { userId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.userId;
    const state: StateQuery = req.query.state;
    const result: ResultState<WritingSchema[]> =
      await this.writingService.getByUserId(userId, state);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };
}

export default WritingController;
