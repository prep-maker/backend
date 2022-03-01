import mongoose from 'mongoose';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { ERROR } from '../../constants/error';
import dummyWritings from '../../fixtures/dummyWritings';
import { WritingModel } from '../../types/writing';
import { useFailState, useSuccessState } from '../../utils/state';
import WritingService from '../writing';

describe('WritingService', () => {
  let writingService: WritingService;
  const userId = '621cafb14ed8fbc8812e845c';
  const objectId = mongoose.Types.ObjectId(userId);
  beforeEach(() => {
    const modelStub: WritingModel = mock();
    when(modelStub.findAllByUserId(deepEqual(objectId))).thenResolve(
      dummyWritings as any
    );
    when(modelStub.findDoneByUserId(deepEqual(objectId))).thenResolve(
      dummyWritings.filter((writing) => writing.isDone) as any
    );
    when(modelStub.findEditingByUserId(deepEqual(objectId))).thenResolve(
      dummyWritings.filter((writing) => !writing.isDone) as any
    );
    when(
      modelStub.create(
        deepEqual({
          isDone: false,
          author: objectId,
          title: 'Untitled',
          blocks: [],
        })
      )
    ).thenResolve({
      _id: mongoose.Types.ObjectId('621cb0b250e465dfac337175'),
      isDone: false,
      author: userId,
      title: 'Untitled',
      blocks: [],
    } as any);
    writingService = new WritingService(instance(modelStub));
  });

  describe('getByUserIdAndState', () => {
    it('잘못된 형식의 userId가 입력되면 status 400의 FailState를 리턴한다.', async () => {
      const result = await writingService.getByUserIdAndState(
        'invalidId',
        undefined
      );

      expect(result).toEqual(useFailState(ERROR.INVALID_ID, 400));
    });

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
  });

  describe('create', () => {
    it('userId가 입력되면 새로운 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.create(userId);

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

      expect(result).toEqual(useFailState(ERROR.INVALID_ID, 400));
    });
  });
});
