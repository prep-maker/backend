import { ERROR } from '../../common/constants/error';
import { BlockRepository, BlockSchema } from '../../common/types/block';
import { WritingRepository } from '../../common/types/writing';
import { useFailState, useSuccessState } from '../../common/utils/state';
import BlockModelStub, { BLOCK_ID } from '../../fixtures/blockModelStub';
import WritingModelStub from '../../fixtures/writingModelStub';
import BlockService from '../../services/block';
import BlockPresenter, { IBlockPresenter } from '../block';

describe('BlockPresenter', () => {
  let blockPresenter: IBlockPresenter;
  let blockModel: BlockRepository;
  let writingModel: WritingRepository;
  beforeEach(() => {
    blockModel = new BlockModelStub();
    writingModel = new WritingModelStub();
    blockPresenter = new BlockPresenter(blockModel, writingModel, BlockService);
  });
  const WRITING_ID = '621cb0b250e465dfac337175';

  describe('create', () => {
    const newBlock: BlockSchema = {
      type: 'P',
      paragraphs: [{ type: 'P', content: '' }],
    };
    it('새로운 block 다큐먼트를 생성하고 관련 writing 다큐먼트를 업데이트 한다.', async () => {
      const spy = jest.spyOn(writingModel, 'updateById');

      const result = await blockPresenter.create(WRITING_ID, newBlock);

      expect(result).toEqual(useSuccessState({ ...newBlock, id: BLOCK_ID }));
      expect(spy).toBeCalledWith(WRITING_ID, { $push: { blocks: BLOCK_ID } });
    });

    it('잘못된 형식의 writingId가 입력되면 status 400의 FailState를 리턴한다.', async () => {
      const result = await blockPresenter.create('invalid id', newBlock);

      expect(result).toEqual(useFailState(ERROR.INVALID_WRITING_ID, 400));
    });
  });
});
