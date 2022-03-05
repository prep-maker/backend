import {
  BlockDocument,
  BlockRepository,
  BlockSchema,
} from '../common/types/block.js';
import { ObjectId } from '../common/types/mongoose.js';
import { WritingRepository } from '../common/types/writing.js';
import { useSuccessState } from '../common/utils/state.js';

type BlockResult = Promise<SuccessState<BlockSchema & { id: ObjectId }>>;

export interface IBlockService {
  create: (writingId: string, block: BlockSchema) => BlockResult;
}

class BlockService {
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
}

export default BlockService;
