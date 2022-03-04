import mongoose, { Document, Model } from 'mongoose';

export type WritingSchema = {
  readonly isDone: boolean;
  readonly author: mongoose.Types.ObjectId;
  readonly title: string;
  readonly blocks: mongoose.Types.ObjectId[];
};

export type WritingResponse = {
  readonly id: mongoose.Types.ObjectId;
  readonly isDone: boolean;
  readonly title: string;
  readonly blocks?: mongoose.Types.ObjectId[];
};

export interface WritingDocument extends WritingSchema, Document {}

export type UpdateQuery = {
  isDone: boolean;
  title: string;
};

export interface WritingRepository {
  findAllByUserId: (
    userId: mongoose.Types.ObjectId
  ) => Promise<WritingDocument[]>;
  findDoneByUserId: (
    userId: mongoose.Types.ObjectId
  ) => Promise<WritingDocument[]>;
  findEditingByUserId: (
    userId: mongoose.Types.ObjectId
  ) => Promise<WritingDocument[]>;
  create: (writing: WritingSchema) => Promise<WritingDocument>;
  deleteById: (id: string) => Promise<mongoose.Types.ObjectId[]>;
  updateById: (id: string, query: UpdateQuery) => Promise<WritingDocument>;
}

export type WritingModel = Model<WritingDocument> & WritingRepository;
