import mongoose from 'mongoose';
import {
  WritingDocument,
  WritingModel,
  WritingSchema,
} from '../types/writing.js';

const writingSchema: mongoose.Schema<WritingDocument> = new mongoose.Schema({
  isDone: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Untitled',
  },
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  blocks: {
    type: [mongoose.Types.ObjectId],
  },
});

writingSchema.statics.findAllByUserId = async function (
  userId: mongoose.Types.ObjectId
): Promise<WritingSchema[]> {
  const writings = await this.find({ author: userId }).lean();

  return writings;
};

writingSchema.statics.findDoneByUserId = async function (
  userId: mongoose.Types.ObjectId
): Promise<WritingSchema[]> {
  const writings = await this.find({ author: userId, isDone: true }).lean();

  return writings;
};

writingSchema.statics.findEditingByUserId = async function (
  userId: mongoose.Types.ObjectId
): Promise<WritingSchema[]> {
  const writings = await this.find({ author: userId, isDone: false }).lean();

  return writings;
};

writingSchema.statics.deleteById = async function (
  writingId: string
): Promise<mongoose.Types.ObjectId[]> {
  const writing = await this.findByIdAndRemove(writingId);

  return writing.blocks;
};

const writingModel = mongoose.model<WritingDocument, WritingModel>(
  'Writing',
  writingSchema
);
export default writingModel;
