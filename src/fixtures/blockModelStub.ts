import mongoose from 'mongoose';
import {
  BlockDocument,
  BlockRepository,
  BlockResponse,
  BlockSchema,
} from '../common/types/block';
import { ObjectId } from '../common/types/mongoose';

export const BLOCK_ID = '621ee328d1172c53545dee69';

class BlockModelStub implements BlockRepository {
  updateById = async (
    blockId: string,
    block: BlockSchema
  ): Promise<BlockResponse> => ({
    ...block,
    id: blockId,
  });

  create = async (block: BlockSchema): Promise<BlockDocument> =>
    ({
      _id: mongoose.Types.ObjectId(BLOCK_ID),
      type: block.type,
      paragraphs: block.paragraphs,
    } as any);

  deleteByIds = async (ids: readonly ObjectId[]): Promise<void> => {};

  createBlocks = async (blocks: BlockSchema[]) =>
    blocks.map((block) => ({
      ...block,
      id: mongoose.Types.ObjectId(BLOCK_ID),
    }));
}

export default BlockModelStub;
