import mongoose from 'mongoose';
import {
  BlockDocument,
  BlockRepository,
  BlockResponse,
  BlockSchema,
} from '../common/types/block.js';
import { WritingRepository } from '../common/types/writing.js';
import { useSuccessState } from '../common/utils/state.js';

type BlockResult = Promise<SuccessState<BlockResponse>>;

export interface IBlockService {
  create: (writingId: string, block: BlockSchema) => BlockResult;
  remove: (writingId: string, blockId: string) => Promise<void>;
}

class BlockService implements IBlockService {
  constructor(
    private readonly blockModel: BlockRepository,
    private readonly writingModel: WritingRepository
  ) {}

  create = async (writingId: string, block: BlockSchema): BlockResult => {
    const newBlock: BlockDocument = await this.blockModel.create(block);
    this.writingModel.updateById(writingId, {
      $push: { blocks: newBlock._id },
    });
    const result = {
      ...block,
      id: newBlock._id,
    };

    return useSuccessState(result);
  };

  remove = async (writingId: string, blockId: string) => {
    const id = mongoose.Types.ObjectId(blockId);
    this.blockModel.deleteByIds([id]);
    this.writingModel.updateById(writingId, { $pull: { blocks: blockId } });
  };
}

export default BlockService;
