import { NextFunction, Response } from 'express';
import { IWritingService } from '../services/writing.js';
import {
  StateQuery,
  TypedRequestParams,
  TypedRequestQueryAndParams,
} from '../types/express.js';
import { WritingDocument, WritingResponse } from '../types/writing.js';

interface IWritingController {
  getWritings: (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, { userId: string }>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  create: (
    req: TypedRequestParams<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
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
    const result: ResultState<WritingDocument[]> =
      await this.writingService.getByUserIdAndState(userId, state);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };

  create = async (
    req: TypedRequestParams<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.userId;
    const result: ResultState<WritingResponse> =
      await this.writingService.create(userId);

    if (result.state !== 'success') {
      return next(result);
    }

    res.status(201).json(result.data);
  };

  remove = async (
    req: TypedRequestParams<{ userId: string; writingId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { userId, writingId } = req.params;
    const result: BadState | void = await this.writingService.remove(
      userId,
      writingId
    );

    if (result?.state) {
      return next(result);
    }

    res.status(204).json();
  };
}

export default WritingController;
