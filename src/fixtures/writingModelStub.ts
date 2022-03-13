import { filter, pipe, toArray } from '@fxts/core';
import mongoose from 'mongoose';
import { BlockResponse } from '../common/types/block';
import { ObjectId } from '../common/types/mongoose';
import {
  WritingDocument,
  WritingRepository,
  WritingSchema,
} from '../common/types/writing';
import { BLOCK_ID } from './blockModelStub';
import dummyWritings from './dummyWritings';

export const WRITING_ID = '621cb0b250e465dfac337175';

class WritingModelStub implements WritingRepository {
  findAllByUserId = async (userId: string): Promise<WritingDocument[]> =>
    getDocumentsByUserId(userId) as any;

  findDoneByUserId = async (userId: string): Promise<WritingDocument[]> =>
    pipe(
      getDocumentsByUserId(userId),
      filter((writing) => writing.isDone),
      toArray
    ) as any;

  findEditingByUserId = async (userId: string): Promise<WritingDocument[]> =>
    pipe(
      getDocumentsByUserId(userId),
      filter((writing) => !writing.isDone),
      toArray
    ) as any;

  findById = (
    writingId: string
  ): Promise<WritingDocument> & {
    populate: (field: string) => { lean: () => Promise<WritingDocument> };
  } => {
    const writing = dummyWritings.find(
      (writing) => writing._id.toString() === writingId
    );

    return {
      populate: (field: string) => ({ lean: () => writing }),
    } as any;
  };

  create = async (writing: WritingSchema): Promise<WritingDocument> =>
    ({
      _id: mongoose.Types.ObjectId(WRITING_ID),
      isDone: false,
      author: writing.author,
      title: writing.title,
      blocks: writing.blocks,
    } as any);

  deleteById = async (wrtingId: string): Promise<BlockResponse[]> => [
    {
      id: mongoose.Types.ObjectId(BLOCK_ID),
      type: 'P',
      paragraphs: [],
    },
  ];

  updateById = async (
    id: string,
    query: Partial<WritingSchema>
  ): Promise<WritingDocument> =>
    ({
      _id: mongoose.Types.ObjectId(id),
      isDone: query.isDone,
      author: 'author',
      title: query.title,
      blocks: query.blocks ?? [],
    } as any);
}

const getDocumentsByUserId = (userId: ObjectId) =>
  pipe(
    dummyWritings,
    filter((writing) => String(writing.author) === String(userId)),
    toArray
  );

export default WritingModelStub;
