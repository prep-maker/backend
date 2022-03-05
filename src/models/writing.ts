import mongoose, { Schema } from 'mongoose';
import { ObjectId } from '../common/types/mongoose.js';
import {
  UpdateQuery,
  WritingDocument,
  WritingModel,
} from '../common/types/writing.js';

const writingSchema: Schema<WritingDocument> = new mongoose.Schema({
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
    ref: 'Block',
  },
});

writingSchema.statics.findAllByUserId = async function (
  userId: string
): Promise<WritingDocument[]> {
  const writings: WritingDocument[] = await this.find({ author: userId })
    .populate('blocks')
    .lean();

  return writings;
};

writingSchema.statics.findDoneByUserId = async function (
  userId: string
): Promise<WritingDocument[]> {
  const writings: WritingDocument[] = await this.find({
    author: userId,
    isDone: true,
  })
    .populate('blocks')
    .lean();

  return writings;
};

writingSchema.statics.findEditingByUserId = async function (
  userId: string
): Promise<WritingDocument[]> {
  const writings: WritingDocument[] = await this.find({
    author: userId,
    isDone: false,
  })
    .populate('blocks')
    .lean();

  return writings;
};

writingSchema.statics.deleteById = async function (
  writingId: string
): Promise<ObjectId[]> {
  const writing: WritingDocument = await this.findByIdAndRemove(
    writingId
  ).lean();

  return writing.blocks;
};

writingSchema.statics.updateById = async function (
  writingId: string,
  query: UpdateQuery
): Promise<WritingDocument> {
  const writing: WritingDocument = await this.findByIdAndUpdate(
    writingId,
    query,
    {
      new: true,
    }
  )
    .populate('blocks')
    .lean();

  return writing;
};

const writingModel = mongoose.model<WritingDocument, WritingModel>(
  'Writing',
  writingSchema
);
export default writingModel;
