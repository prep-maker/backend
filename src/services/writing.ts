import { BlockRepository } from '../common/types/block.js';
import { StateQuery } from '../common/types/express.js';
import { ObjectId } from '../common/types/mongoose.js';
import { UserRepository } from '../common/types/user.js';
import {
  UpdateQuery,
  WritingDocument,
  WritingRepository,
  WritingResponse,
} from '../common/types/writing.js';
import { useSuccessState } from '../common/utils/state.js';

type WritingResult = Promise<SuccessState<WritingResponse>>;
type WritingListResult = Promise<SuccessState<WritingResponse[]>>;

export interface IWritingService {
  getByUserIdAndState: (userId: string, state: StateQuery) => WritingListResult;
  create: (userId: string) => WritingResult;
  remove: (userId: string, writingId: string) => Promise<void | BadState>;
  update: (writingId: string, query: UpdateQuery) => WritingResult;
}

class WritingService implements IWritingService {
  constructor(
    private readonly writingModel: WritingRepository,
    private readonly userModel: UserRepository,
    private readonly blockModel: BlockRepository
  ) {}

  getByUserIdAndState = async (
    userId: string,
    state: StateQuery
  ): WritingListResult => {
    const writings: WritingDocument[] = await this.findByUserIdAndState(
      userId,
      state
    );
    const result: WritingResponse[] = writings.map((writing) => ({
      id: writing._id,
      isDone: writing.isDone,
      title: writing.title,
      blocks: writing.blocks,
    }));

    return useSuccessState(result);
  };

  private findByUserIdAndState = async (
    userId: string,
    state: StateQuery
  ): Promise<WritingDocument[]> => {
    let result: WritingDocument[];
    switch (state) {
      case 'done': {
        result = await this.writingModel.findDoneByUserId(userId);
        return result;
      }

      case 'editing': {
        result = await this.writingModel.findEditingByUserId(userId);
        return result;
      }

      default: {
        result = await this.writingModel.findAllByUserId(userId);
        return result;
      }
    }
  };

  create = async (userId: string): WritingResult => {
    const initial = {
      isDone: false,
      author: userId,
      title: 'Untitled',
      blocks: [],
    };
    const newWriting: WritingDocument = await this.writingModel.create(initial);
    this.userModel.addWriting(userId, newWriting._id);

    return useSuccessState({
      id: newWriting._id,
      isDone: false,
      title: 'Untitled',
      blocks: [],
    });
  };

  remove = async (userId: string, writingId: string): Promise<void> => {
    this.userModel.deleteWriting(userId, writingId);
    const blockIds: ObjectId[] = await this.writingModel.deleteById(writingId);
    this.blockModel.deleteByIds(blockIds);
  };

  update = async (writingId: string, query: UpdateQuery): WritingResult => {
    const updated: WritingDocument = await this.writingModel.updateById(
      writingId,
      query
    );
    const { _id, isDone, title, blocks } = updated;

    return useSuccessState({
      id: _id,
      isDone,
      title,
      blocks,
    });
  };
}

export default WritingService;
