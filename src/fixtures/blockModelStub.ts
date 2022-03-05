import { BlockRepository } from '../common/types/block';
import { ObjectId } from '../common/types/mongoose';

class BlockModelStub implements BlockRepository {
  deleteByIds = async (ids: readonly ObjectId[]): Promise<void> => {};
}
export default BlockModelStub;
