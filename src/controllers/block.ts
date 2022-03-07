import { NextFunction, Response } from 'express';
import { BlockSchema } from '../common/types/block.js';
import {
  BlockIdParam,
  TypedRequestBodyAndParams,
  TypedRequestParams,
  UserIdParam,
  WritingIdParam,
} from '../common/types/express.js';
import { ObjectId } from '../common/types/mongoose.js';
import { IBlockPresenter } from '../presenter/block.js';

interface IBlockController {
  create: (
    req: TypedRequestBodyAndParams<BlockSchema, UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  remove: (
    req: TypedRequestParams<WritingIdParam & BlockIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  update: (
    req: TypedRequestBodyAndParams<BlockSchema[], UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

class BlockController implements IBlockController {
  constructor(private readonly blockPresenter: IBlockPresenter) {}

  create = async (
    req: TypedRequestBodyAndParams<BlockSchema, UserIdParam & WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId } = req.params;
    const block: BlockSchema = req.body;
    const result: ResultState<BlockSchema & { id: ObjectId }> =
      await this.blockPresenter.create(writingId, block);

    if (result.state !== 'success') {
      return next(result);
    }

    res.status(201).json(result.data);
  };

  remove = async (
    req: TypedRequestParams<WritingIdParam & BlockIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId, blockId } = req.params;
    const result = await this.blockPresenter.remove(writingId, blockId);

    if (result?.state) {
      return next(result);
    }

    res.sendStatus(204);
  };

  update = async (
    req: TypedRequestBodyAndParams<BlockSchema[], WritingIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    const { writingId } = req.params;
    const blocks = req.body;
    const result = await this.blockPresenter.update(writingId, blocks);

    if (result.state !== 'success') {
      return next(result);
    }

    res.json(result);
  };
}

export default BlockController;
