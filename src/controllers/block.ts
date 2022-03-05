import { NextFunction, Response } from 'express';
import { BlockSchema } from '../common/types/block.js';
import {
  TypedRequestBodyAndParams,
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

    res.json(result.data);
  };
}

export default BlockController;
