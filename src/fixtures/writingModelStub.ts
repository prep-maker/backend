import { filter, pipe, toArray } from '@fxts/core';
import mongoose from 'mongoose';
import { ObjectId } from '../types/mongoose';
import {
  UpdateQuery,
  WritingDocument,
  WritingRepository,
  WritingSchema,
} from '../types/writing';
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

  deleteById = async (wrtingId: string): Promise<ObjectId[]> => [
    'blockId1',
    'blockId2',
  ];

  updateById = async (
    id: string,
    query: UpdateQuery
  ): Promise<WritingDocument> =>
    ({
      _id: mongoose.Types.ObjectId(id),
      isDone: query.isDone,
      author: 'author',
      title: query.title,
      blocks: [],
    } as any);
}

const getDocumentsByUserId = (userId: ObjectId) =>
  pipe(
    dummyWritings,
    filter((writing) => String(writing.author) === String(userId)),
    toArray
  );

export default WritingModelStub;
