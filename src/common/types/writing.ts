import { Document, Model, MongooseUpdateQuery } from 'mongoose';
import { BlockDocument, BlockResponse } from './block';
import { ObjectId } from './mongoose';

export type WritingSchema = {
  readonly isDone: boolean;
  readonly author: ObjectId;
  readonly title: string;
  readonly blocks: BlockDocument[];
};

export type WritingResponse = {
  readonly id: ObjectId;
  readonly isDone: boolean;
  readonly author: ObjectId;
  readonly title: string;
  readonly blocks?: BlockDocument[];
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
  deleteById: (id: string) => Promise<BlockResponse[]>;
  updateById: (
    id: string,
    query: Partial<WritingSchema> | MongooseUpdateQuery<this>,
    option?: { new: boolean }
  ) => Promise<WritingDocument>;
}

export type WritingModel = Model<WritingDocument> & WritingRepository;
