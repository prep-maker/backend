import { NextFunction, Response } from 'express';
import { BlockResponse, BlockSchema } from '../common/types/block.js';
import {
  StateQuery,
  TypedRequestBodyAndParams,
  TypedRequestParams,
  TypedRequestQueryAndParams,
  UserIdParam,
  WritingIdParam,
} from '../common/types/express.js';
import { UpdateQuery, WritingResponse } from '../common/types/writing.js';
import { IWritingPresenter } from '../presenter/writing.js';

interface IWritingController {
  getWritings: (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, UserIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getOne: (
    req: TypedRequestParams<{ writingId: string }>,
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
  updateBlocks: (
    req: TypedRequestBodyAndParams<BlockSchema[], UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

class WritingController implements IWritingController {
  constructor(private readonly writingPresenter: IWritingPresenter) {}

  getWritings = async (
    req: TypedRequestQueryAndParams<{ state: StateQuery }, UserIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.params;
    const state: StateQuery = req.query.state;
    const result: ResultState<WritingResponse[]> =
      await this.writingPresenter.getByUserIdAndState(userId, state);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };

  getOne = async (
    req: TypedRequestParams<{ writingId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId } = req.params;
    const result: ResultState<WritingResponse> =
      await this.writingPresenter.getOneById(writingId);

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
    const { userId } = req.params;
    const result: ResultState<WritingResponse> =
      await this.writingPresenter.create(userId);

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
    const result: ResultState<BlockResponse[]> =
      await this.writingPresenter.remove(userId, writingId);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };

  update = async (
    req: TypedRequestBodyAndParams<UpdateQuery, WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId } = req.params;
    const { title, isDone } = req.body;
    const result: ResultState<WritingResponse> =
      await this.writingPresenter.update(writingId, { title, isDone });

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };

  updateBlocks = async (
    req: TypedRequestBodyAndParams<BlockSchema[], WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId } = req.params;
    const blocks = req.body;

    const result = await this.writingPresenter.updateBlocks(writingId, blocks);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result.data);
  };
}

export default WritingController;
