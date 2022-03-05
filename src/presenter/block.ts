import { pipe } from '@fxts/core';
import mongoose from 'mongoose';
import { ERROR } from '../common/constants/error.js';
import { BlockRepository, BlockSchema } from '../common/types/block.js';
import { ObjectId } from '../common/types/mongoose.js';
import { WritingRepository } from '../common/types/writing.js';
import catchError from '../common/utils/catchError.js';
import { useFailState } from '../common/utils/state.js';
import BlockService, { IBlockService } from '../services/block.js';

type BlockResult = Promise<ResultState<BlockSchema & { id: ObjectId }>>;

export interface IBlockPresenter {
  create: (writingId: string, block: BlockSchema) => BlockResult;
  remove: (writingId: string, blockId: string) => Promise<BadState | void>;
}

class BlockPresenter implements IBlockPresenter {
  private readonly blockService: IBlockService;
  constructor(
    private readonly blockModel: BlockRepository,
    private readonly writingModel: WritingRepository,
    private readonly BlockService: new (
      blockModel: BlockRepository,
      writingMode: WritingRepository
    ) => BlockService
  ) {
    this.blockService = new this.BlockService(
      this.blockModel,
      this.writingModel
    );
  }

  create = async (writingId: string, block: BlockSchema): BlockResult => {
    if (!mongoose.isValidObjectId(writingId)) {
      return useFailState(ERROR.INVALID_WRITING_ID, 400);
    }

    const result = await pipe(
      this.blockService.create.bind(this, writingId, block),
      catchError
    );

    return result;
  };

  remove = async (writingId: string, blockId: string) => {
    if (!mongoose.isValidObjectId(writingId)) {
      return useFailState(ERROR.INVALID_WRITING_ID, 400);
    }

    if (!mongoose.isValidObjectId(blockId)) {
      return useFailState(ERROR.INVALID_BLOCK_ID, 400);
    }

    const result = await pipe(
      this.blockService.remove.bind(this, writingId, blockId),
      catchError
    );

    return result;
  };
}

export default BlockPresenter;
