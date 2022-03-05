import { NextFunction, Response } from 'express';
import {
  StateQuery,
  TypedRequestBodyAndParams,
  TypedRequestParams,
  TypedRequestQueryAndParams,
} from '../common/types/express.js';
import { UpdateQuery, WritingResponse } from '../common/types/writing.js';
import { IWritingService } from '../services/writing.js';

type UserIdParam = { userId: string };
type WritingIdParam = { writingId: string };

interface IWritingController {
  getWritings: (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, UserIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  create: (
    req: TypedRequestParams<UserIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  remove: (
    req: TypedRequestParams<UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  update: (
    req: TypedRequestBodyAndParams<UpdateQuery, UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

class WritingController implements IWritingController {
  constructor(private readonly writingService: IWritingService) {}

  getWritings = async (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, UserIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.userId;
    const state: StateQuery = req.query.state;
    const result: ResultState<WritingResponse[]> =
      await this.writingService.getByUserIdAndState(userId, state);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };

  create = async (
    req: TypedRequestParams<UserIdParam>,
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
    req: TypedRequestParams<UserIdParam & WritingIdParam>,
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

  update = async (
    req: TypedRequestBodyAndParams<UpdateQuery, UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId } = req.params;
    const { title, isDone } = req.body;
    const result: ResultState<WritingResponse> =
      await this.writingService.update(writingId, { title, isDone });

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };
}

export default WritingController;
