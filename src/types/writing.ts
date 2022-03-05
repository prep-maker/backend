import { Document, Model } from 'mongoose';
import { ObjectId } from './mongoose';

export type WritingSchema = {
  readonly isDone: boolean;
  readonly author: ObjectId;
  readonly title: string;
  readonly blocks: ObjectId[];
};

export type WritingResponse = {
  readonly id: ObjectId;
  readonly isDone: boolean;
  readonly title: string;
  readonly blocks?: ObjectId[];
};

export interface WritingDocument extends WritingSchema, Document {}

export type UpdateQuery = {
  isDone: boolean;
  title: string;
};

export interface WritingRepository {
  findAllByUserId: (userId: ObjectId) => Promise<WritingDocument[]>;
  findDoneByUserId: (userId: ObjectId) => Promise<WritingDocument[]>;
  findEditingByUserId: (userId: ObjectId) => Promise<WritingDocument[]>;
  create: (writing: WritingSchema) => Promise<WritingDocument>;
  deleteById: (id: string) => Promise<ObjectId[]>;
  updateById: (id: string, query: UpdateQuery) => Promise<WritingDocument>;
}

export type WritingModel = Model<WritingDocument> & WritingRepository;
