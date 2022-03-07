import mongoose from 'mongoose';
import {
  BlockDocument,
  BlockRepository,
  BlockSchema,
} from '../common/types/block';
import { ObjectId } from '../common/types/mongoose';

export const BLOCK_ID = mongoose.Types.ObjectId('621ee328d1172c53545dee69');

class BlockModelStub implements BlockRepository {
  create = async (block: BlockSchema): Promise<BlockDocument> =>
    ({
      _id: BLOCK_ID,
      type: block.type,
      paragraphs: block.paragraphs,
    } as any);
  deleteByIds = async (ids: readonly ObjectId[]): Promise<void> => {};
  createBlocks = async (blocks: BlockSchema[]) =>
    blocks.map((block) => ({ ...block, id: BLOCK_ID }));
}
export default BlockModelStub;
