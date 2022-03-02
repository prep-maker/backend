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
  const userId = '621cafb14ed8fbc8812e845c';

  beforeEach(() => {
    writingModelStub = new WritingModelStub();
    userModelStub = new UserModelStub();
    writingService = new WritingService(
      writingModelStub,
      userModelStub,
      blockModelStub
    );
  });

  describe('getByUserIdAndState', () => {
    it('userId가 입력되면 author와 userId가 매치되는 모든 다큐먼트를 SuccessState로 리턴한다.', async () => {
      const result = await writingService.getByUserIdAndState(
        userId,
        undefined
      );

      expect(result).toEqual(useSuccessState(dummyWritings));
    });

    it('state 매개변수에 "done"이 입력되면 isDone이 true인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.getByUserIdAndState(userId, 'done');

      expect(result).toEqual(
        useSuccessState(dummyWritings.filter((writing) => writing.isDone))
      );
    });

    it('state 매개변수에 "editing"이 입력되면 isDone이 false인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.getByUserIdAndState(userId, 'done');

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

      const result = await writingService.create(userId);

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

    it('잘못된 형식의 userId가 입력되면 status 400의 FailState를 리턴한다.', async () => {
      const result = await writingService.create('invalidId');

      expect(result).toEqual(useFailState(ERROR.INVALID_USER_ID, 400));
    });
  });
});
