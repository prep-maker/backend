import mongoose from 'mongoose';
import { BlockRepository } from '../types/block';

class BlockModelStub implements BlockRepository {
  deleteByIds = async (
    ids: readonly mongoose.Types.ObjectId[]
  ): Promise<void> => {};
}
export default BlockModelStub;
