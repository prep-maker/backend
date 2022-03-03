import mongoose from 'mongoose';
import { ERROR } from '../../constants/error';
import BlockModelStub from '../../fixtures/blockModelStub';
import dummyWritings from '../../fixtures/dummyWritings';
import UserModelStub from '../../fixtures/userModelStub';
import WritingModelStub from '../../fixtures/writingModelStub';
import { useFailState, useSuccessState } from '../../utils/state';
import WritingService from '../writing';

describe('WritingService', () => {
  let writingService: WritingService;
  let userModelStub: UserModelStub;
  let writingModelStub: WritingModelStub;
  let blockModelStub: BlockModelStub;
  const USER_ID = '621cafb14ed8fbc8812e845c';
  const WRITING_ID = '621cb0b250e465dfac337175';

  beforeEach(() => {
    writingModelStub = new WritingModelStub();
    userModelStub = new UserModelStub();
    blockModelStub = new BlockModelStub();
    writingService = new WritingService(
      writingModelStub,
      userModelStub,
      blockModelStub
    );
  });

  describe('getByUserIdAndState', () => {
    it('userId가 입력되면 author와 userId가 매치되는 모든 다큐먼트를 SuccessState로 리턴한다.', async () => {
      const result = await writingService.getByUserIdAndState(
        USER_ID,
        undefined
      );

      expect(result).toEqual(useSuccessState(dummyWritings));
    });

    it('state 매개변수에 "done"이 입력되면 isDone이 true인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.getByUserIdAndState(USER_ID, 'done');

      expect(result).toEqual(
        useSuccessState(dummyWritings.filter((writing) => writing.isDone))
      );
    });

    it('state 매개변수에 "editing"이 입력되면 isDone이 false인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.getByUserIdAndState(USER_ID, 'done');

      expect(result).toEqual(
        useSuccessState(dummyWritings.filter((writing) => writing.isDone))
      );
    });

    it('잘못된 형식의 userId가 입력되면 status 400의 FailState를 리턴한다.', async () => {
      const result = await writingService.getByUserIdAndState(
        'invalidId',
        undefined
      );

      expect(result).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));
    });
  });

  describe('create', () => {
    it('userId가 입력되면 새 writing을 생성하고 SuccessState로 리턴한다', async () => {
      const spy = jest.spyOn(userModelStub, 'addWriting');

      const result = await writingService.create(USER_ID);

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(
        useSuccessState({
          writingId: mongoose.Types.ObjectId('621cb0b250e465dfac337175'),
          isDone: false,
          title: 'Untitled',
          blocks: [],
        })
      );
    });

    it('잘못된 형식의 userId가 입력되면 status 400 FailState를 리턴한다.', async () => {
      const result = await writingService.create('invalidId');

      expect(result).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));
    });
  });

  describe('remove', () => {
    it('잘못된 형식 userId나 writingId가 입력되면 status 400 FaliState를 리턴한다', async () => {
      const invalidUserId = await writingService.remove(
        'invalidId',
        '621cb0b250e465dfac337175'
      );

      expect(invalidUserId).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));

      const invalidWritingId = await writingService.remove(
        '621cb0b250e465dfac337175',
        'invalidId'
      );

      expect(invalidWritingId).toEqual(
        useFailState(ERROR.INVALID_WRITING_ID, 400)
      );
    });

    it('writing 모델과 관련 user 모델, block 모델에서 해당 writing을 모두 삭제한다.', async () => {
      const userSpy = jest.spyOn(userModelStub, 'deleteWriting');
      const writingSpy = jest.spyOn(writingModelStub, 'deleteById');
      const blockSpy = jest.spyOn(blockModelStub, 'deleteByIds');

      await writingService.remove(USER_ID, WRITING_ID);

      expect(userSpy).toBeCalledWith(USER_ID, WRITING_ID);
      expect(writingSpy).toBeCalledWith(WRITING_ID);
      expect(blockSpy).toBeCalledWith(['blockId1', 'blockId2']);
    });
  });
});
