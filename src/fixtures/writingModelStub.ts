import { filter, pipe, toArray } from '@fxts/core';
import mongoose from 'mongoose';
import {
  WritingDocument,
  WritingRepository,
  WritingSchema,
} from '../types/writing';
import dummyWritings from './dummyWritings';

class WritingModelStub implements WritingRepository {
  findAllByUserId = async (
    userId: mongoose.Types.ObjectId
  ): Promise<WritingDocument[]> => getDocumentsByUserId(userId) as any;

  findDoneByUserId = async (
    userId: mongoose.Types.ObjectId
  ): Promise<WritingDocument[]> =>
    pipe(
      getDocumentsByUserId(userId),
      filter((writing) => writing.isDone),
      toArray
    ) as any;

  findEditingByUserId = async (
    userId: mongoose.Types.ObjectId
  ): Promise<WritingDocument[]> =>
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
}

const getDocumentsByUserId = (userId: mongoose.Types.ObjectId) =>
  pipe(
    dummyWritings,
    filter((writing) => String(writing.author) === String(userId)),
    toArray
  );

export default WritingModelStub;
