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
type BlockListResult = Promise<SuccessState<BlockResponse[]>>;

export interface IBlockService {
  create: (writingId: string, block: BlockSchema) => BlockResult;
  remove: (writingId: string, blockId: string) => Promise<void>;
  update: (writingId: string, blocks: BlockSchema[]) => BlockListResult;
}

class BlockService implements IBlockService {
  constructor(
    private readonly blockModel: BlockRepository,
    private readonly writingModel: WritingRepository
  ) {}

  update = async (
    writingId: string,
    blocks: BlockSchema[]
  ): BlockListResult => {
    const newBlocks = await this.blockModel.createBlocks(blocks);
    const blockIds = newBlocks.map((block) => block.id);
    const writing = await this.writingModel.updateById(
      writingId,
      { blocks: blockIds },
      { new: false }
    );
    const oldBlocks = writing.blocks.map((block) => block._id);
    await this.blockModel.deleteByIds(oldBlocks);

    return useSuccessState(newBlocks);
  };

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
