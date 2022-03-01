import mongoose, { Document, Model } from 'mongoose';

export type WritingSchema = {
  readonly isDone: boolean;
  readonly author: mongoose.Types.ObjectId;
  readonly title: string;
  readonly blocks: mongoose.Types.ObjectId[];
};

export type WritingResponse = {
  readonly writingId: mongoose.Types.ObjectId;
  readonly isDone: boolean;
  readonly title: string;
  readonly blocks?: mongoose.Types.ObjectId[];
};

export interface WritingDocument extends WritingSchema, Document {}

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
}

export type WritingModel = Model<WritingDocument> & WritingRepository;
