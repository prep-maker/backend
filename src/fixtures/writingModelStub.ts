import { filter, pipe, toArray } from '@fxts/core';
import mongoose from 'mongoose';
import { BlockResponse } from '../common/types/block';
import { ObjectId } from '../common/types/mongoose';
import {
  WritingDocument,
  WritingRepository,
  WritingSchema,
} from '../common/types/writing';
import dummyWritings from './dummyWritings';

class WritingModelStub implements WritingRepository {
  findAllByUserId = async (userId: ObjectId): Promise<WritingDocument[]> =>
    getDocumentsByUserId(userId) as any;

  findDoneByUserId = async (userId: ObjectId): Promise<WritingDocument[]> =>
    pipe(
      getDocumentsByUserId(userId),
      filter((writing) => writing.isDone),
      toArray
    ) as any;

  findEditingByUserId = async (userId: ObjectId): Promise<WritingDocument[]> =>
    pipe(
      getDocumentsByUserId(userId),
      filter((writing) => !writing.isDone),
      toArray
    ) as any;

  create = async (writing: WritingSchema): Promise<WritingDocument> =>
    ({
      _id: mongoose.Types.ObjectId('621cb0b250e465dfac337175'),
      isDone: false,
      author: writing.author,
      title: writing.title,
      blocks: writing.blocks,
    } as any);

  deleteById = async (wrtingId: string): Promise<BlockResponse[]> => [
    {
      id: mongoose.Types.ObjectId('621cb0b250e465dfac337175'),
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
