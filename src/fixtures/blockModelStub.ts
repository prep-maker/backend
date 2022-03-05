import { BlockRepository } from '../types/block';
import { ObjectId } from '../types/mongoose';

class BlockModelStub implements BlockRepository {
  deleteByIds = async (ids: readonly ObjectId[]): Promise<void> => {};
}
export default BlockModelStub;
