import {
  BlockDocument,
  BlockRepository,
  BlockResponse,
  BlockSchema,
} from '../common/types/block.js';
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
type BlockListResult = Promise<SuccessState<BlockResponse[]>>;

export interface IWritingService {
  getByUserIdAndState: (userId: string, state: StateQuery) => WritingListResult;
  getOneById: (writingId: string) => WritingResult;
  create: (userId: string) => WritingResult;
  remove: (userId: string, writingId: string) => BlockListResult;
  update: (writingId: string, query: UpdateQuery) => WritingResult;
  updateBlocks: (writingId: string, blocks: BlockSchema[]) => BlockListResult;
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
    const result: WritingResponse[] = writings.map(this.mapWritingToResponse);

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

  getOneById = async (writingId: string): WritingResult => {
    const writing: WritingDocument = await this.writingModel
      .findById(writingId)
      .populate('blocks')
      .lean();
    const result: WritingResponse = this.mapWritingToResponse(writing);

    return useSuccessState(result);
  };

  private mapWritingToResponse = (
    writing: WritingDocument
  ): WritingResponse => ({
    id: writing._id,
    isDone: writing.isDone,
    author: writing.author,
    title: writing.title,
    blocks: writing.blocks.map((block) => ({
      ...block,
      id: block._id,
    })) as BlockDocument[] & { id: ObjectId },
  });

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
      author: newWriting.author,
      title: 'Untitled',
      blocks: [],
    });
  };

  remove = async (userId: string, writingId: string): BlockListResult => {
    this.userModel.deleteWriting(userId, writingId);
    const blocks: BlockResponse[] = await this.writingModel.deleteById(
      writingId
    );
    const blockIds = blocks.map((block) => block.id);
    this.blockModel.deleteByIds(blockIds);

    return useSuccessState(blocks);
  };

  update = async (writingId: string, query: UpdateQuery): WritingResult => {
    const updated: WritingDocument = await this.writingModel.updateById(
      writingId,
      query
    );
    const { _id, isDone, author, title, blocks } = updated;

    return useSuccessState({
      id: _id,
      isDone,
      author,
      title,
      blocks,
    });
  };

  updateBlocks = async (
    writingId: string,
    blocks: BlockSchema[]
  ): BlockListResult => {
    const newBlocks = await this.blockModel.createBlocks(blocks);
    const blockIds = newBlocks.map((block) => block.id);
    const writing = await this.writingModel.updateById(
      writingId,
      { blocks: blockIds },
      { new: false }
    );
    const oldBlocks = writing.blocks.map((block) => block._id);
    await this.blockModel.deleteByIds(oldBlocks);

    return useSuccessState(newBlocks);
  };
}

export default WritingService;
