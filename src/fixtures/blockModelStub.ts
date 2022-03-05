import mongoose from 'mongoose';
import {
  BlockDocument,
  BlockRepository,
  BlockSchema,
} from '../common/types/block';
import { ObjectId } from '../common/types/mongoose';

export const newBlockId = mongoose.Types.ObjectId('621ee328d1172c53545dee69');

class BlockModelStub implements BlockRepository {
  create = async (block: BlockSchema): Promise<BlockDocument> =>
    ({
      _id: newBlockId,
      type: block.type,
      paragraphs: block.paragraphs,
    } as any);
  deleteByIds = async (ids: readonly ObjectId[]): Promise<void> => {};
}
export default BlockModelStub;
