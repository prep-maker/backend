import { concurrent, map, pipe, toAsync } from '@fxts/core';
import mongoose from 'mongoose';
import { BlockModel, BlockSchema, ParagraphSchema } from '../types/block.js';

const paragraphSchema: mongoose.Schema<ParagraphSchema> = new mongoose.Schema({
  type: {
    type: String,
    enum: ['P', 'R', 'E'],
    required: true,
  },
  content: {
    type: String,
  },
});

const blockSchema: mongoose.Schema<BlockSchema> = new mongoose.Schema({
  type: {
    type: String,
    enum: ['P', 'R', 'E', 'PR', 'RE', 'EP', 'PRE', 'REP', 'PREP'],
    required: true,
  },
  canMerge: {
    type: Boolean,
    required: true,
  },
  paragraphs: {
    type: [paragraphSchema],
  },
});

blockSchema.statics.deleteByIds = async function (
  ids: readonly mongoose.Types.ObjectId[]
): Promise<void> {
  pipe(
    ids,
    toAsync,
    map(this.findByIdAndRemove.bind(blockModel)),
    concurrent(5)
  );
};

const blockModel = mongoose.model<BlockSchema, BlockModel>(
  'block',
  blockSchema
);

export default blockModel;
