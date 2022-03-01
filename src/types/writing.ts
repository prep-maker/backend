import mongoose, { Document, Model } from 'mongoose';

export type WritingSchema = {
  readonly isDone: boolean;
  readonly author: mongoose.Types.ObjectId;
  readonly title: string;
  readonly blocks: mongoose.Types.ObjectId[];
};

export interface WritingDocument extends WritingSchema, Document {}

export interface WritingRepository {
  findAllByUserId: (
    userId: mongoose.Types.ObjectId
  ) => Promise<WritingSchema[]>;
  findDoneByUserId: (
    userId: mongoose.Types.ObjectId
  ) => Promise<WritingSchema[]>;
  findEditingByUserId: (
    userId: mongoose.Types.ObjectId
  ) => Promise<WritingSchema[]>;
}

export type WritingModel = Model<WritingDocument> & WritingRepository;
