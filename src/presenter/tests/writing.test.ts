import mongoose from 'mongoose';
import { ERROR } from '../../common/constants/error';
import { ObjectId } from '../../common/types/mongoose';
import { WritingSchema } from '../../common/types/writing';
import { useFailState, useSuccessState } from '../../common/utils/state';
import BlockModelStub from '../../fixtures/blockModelStub';
import dummyWritings from '../../fixtures/dummyWritings';
import UserModelStub from '../../fixtures/userModelStub';
import WritingModelStub from '../../fixtures/writingModelStub';
import WritingService from '../../services/writing';
import WritingPresenter from '../writing';

describe('WritingPresenter', () => {
  let writingPresenter: WritingPresenter;
  let userModelStub: UserModelStub;
  let writingModelStub: WritingModelStub;
  let blockModelStub: BlockModelStub;
  const USER_ID = '621cafb14ed8fbc8812e845c';
  const WRITING_ID = '621cb0b250e465dfac337175';
  const INVALID_ID = 'invalid id';

  beforeEach(() => {
    writingModelStub = new WritingModelStub();
    userModelStub = new UserModelStub();
    blockModelStub = new BlockModelStub();
    writingPresenter = new WritingPresenter(
      writingModelStub,
      userModelStub,
      blockModelStub,
      WritingService
    );
  });

  describe('getByUserIdAndState', () => {
    it('userId가 입력되면 author와 userId가 매치되는 모든 다큐먼트를 SuccessState로 리턴한다.', async () => {
      const result = await writingPresenter.getByUserIdAndState(
        USER_ID,
        undefined
      );
      const expected = dummyWritings.map(mapWriting);

      expect(result).toEqual(useSuccessState(expected));
    });

    it('state 매개변수에 "done"이 입력되면 isDone이 true인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingPresenter.getByUserIdAndState(
        USER_ID,
        'done'
      );
      const done = dummyWritings
        .filter((writing) => writing.isDone)
        .map(mapWriting);

      expect(result).toEqual(useSuccessState(done));
    });

    it('state 매개변수에 "editing"이 입력되면 isDone이 false인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingPresenter.getByUserIdAndState(
        USER_ID,
        'editing'
      );
      const editing = dummyWritings
        .filter((writing) => !writing.isDone)
        .map(mapWriting);

      expect(result).toEqual(useSuccessState(editing));
    });

    it('잘못된 형식의 userId가 입력되면 status 400의 FailState를 리턴한다.', async () => {
      const result = await writingPresenter.getByUserIdAndState(
        INVALID_ID,
        undefined
      );

      expect(result).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));
    });
  });

  describe('create', () => {
    it('userId가 입력되면 새 writing을 생성하고 SuccessState로 리턴한다', async () => {
      const spy = jest.spyOn(userModelStub, 'addWriting');
      const newWriting = {
        id: mongoose.Types.ObjectId('621cb0b250e465dfac337175'),
        isDone: false,
        title: 'Untitled',
        blocks: [],
      };

      const result = await writingPresenter.create(USER_ID);

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(useSuccessState(newWriting));
    });

    it('잘못된 형식의 userId가 입력되면 status 400 FailState를 리턴한다.', async () => {
      const result = await writingPresenter.create(INVALID_ID);

      expect(result).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));
    });
  });

  describe('remove', () => {
    it('잘못된 형식 userId나 writingId가 입력되면 status 400 FaliState를 리턴한다.', async () => {
      const invalidUserId = await writingPresenter.remove(
        INVALID_ID,
        WRITING_ID
      );
      const invalidWritingId = await writingPresenter.remove(
        USER_ID,
        INVALID_ID
      );

      expect(invalidUserId).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));
      expect(invalidWritingId).toEqual(
        useFailState(ERROR.INVALID_WRITING_ID, 400)
      );
    });

    it('writing 모델과 관련 user 모델, block 모델에서 해당 writing을 모두 삭제한다.', async () => {
      const userSpy = jest.spyOn(userModelStub, 'deleteWriting');
      const writingSpy = jest.spyOn(writingModelStub, 'deleteById');
      const blockSpy = jest.spyOn(blockModelStub, 'deleteByIds');

      await writingPresenter.remove(USER_ID, WRITING_ID);

      expect(userSpy).toBeCalledWith(USER_ID, WRITING_ID);
      expect(writingSpy).toBeCalledWith(WRITING_ID);
      expect(blockSpy).toBeCalledWith(['blockId1', 'blockId2']);
    });
  });

  describe('update', () => {
    it('잘못된 형식 writingId가 입력되면 status 400 FaliState를 리턴한다.', async () => {
      const result = await writingPresenter.update(INVALID_ID, {
        title: '',
        isDone: false,
      });

      expect(result).toEqual(useFailState(ERROR.INVALID_WRITING_ID, 400));
    });

    it('요청대로 writing을 업데이트하고 업데이트된 writingId, isDone, title, blocks를 응답한다.', async () => {
      const result = await writingPresenter.update(WRITING_ID, {
        title: 'update',
        isDone: true,
      });
      const updated = {
        id: mongoose.Types.ObjectId(WRITING_ID),
        isDone: true,
        title: 'update',
        blocks: [],
      };

      expect(result).toEqual(useSuccessState(updated));
    });
  });
});

const mapWriting = (writing: WritingSchema & { _id: ObjectId }) => {
  return {
    id: writing._id,
    isDone: writing.isDone,
    title: writing.title,
    blocks: writing.blocks,
  };
};
