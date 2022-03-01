import { ERROR } from '../../constants/error';
import dummyWritings from '../../models/mock_writings.json';
import { WritingRepository } from '../../types/writing.js';
import { useFailState, useSuccessState } from '../../utils/state';
import WritingService from '../writing';

describe('WritingService', () => {
  describe('getByUserIdAndState', () => {
    let writingModel: WritingRepository;
    let writingService: WritingService;
    const userId = '621cafb14ed8fbc8812e845c';
    beforeEach(() => {
      writingModel = {
        findAllByUserId: jest.fn(async () => dummyWritings),
        findDoneByUserId: jest.fn(async () =>
          dummyWritings.filter((writing) => writing.isDone)
        ),
        findEditingByUserId: jest.fn(async () =>
          dummyWritings.filter((writing) => !writing.isDone)
        ),
      };
      writingService = new WritingService(writingModel);
    });

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

      expect(writingModel.findAllByUserId).toHaveBeenCalled();
      expect(result).toEqual(useSuccessState(dummyWritings));
    });

    it('state 매개변수에 "done"이 입력되면 isDone이 true인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.getByUserIdAndState(userId, 'done');

      expect(writingModel.findDoneByUserId).toHaveBeenCalled();
      expect(result).toEqual(
        useSuccessState(dummyWritings.filter((writing) => writing.isDone))
      );
    });

    it('state 매개변수에 "editing"이 입력되면 isDone이 false인 writing 다큐먼트를 SuccessState로 리턴한다', async () => {
      const result = await writingService.getByUserIdAndState(userId, 'done');

      expect(writingModel.findDoneByUserId).toHaveBeenCalled();
      expect(result).toEqual(
        useSuccessState(dummyWritings.filter((writing) => writing.isDone))
      );
    });
  });
});
