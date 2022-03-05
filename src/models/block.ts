import { concurrent, map, pipe, toAsync } from '@fxts/core';
import mongoose, { Schema } from 'mongoose';
import {
  BlockModel,
  BlockSchema,
  ParagraphSchema,
} from '../common/types/block.js';
import { ObjectId } from '../common/types/mongoose.js';

const paragraphSchema: Schema<ParagraphSchema> = new mongoose.Schema({
  type: {
    type: String,
    enum: ['P', 'R', 'E'],
    required: true,
  },
  content: {
    type: String,
  },
});

const blockSchema: Schema<BlockSchema> = new mongoose.Schema({
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
  ids: readonly ObjectId[]
): Promise<void> {
  pipe(
    ids,
    toAsync,
    map(this.findByIdAndRemove.bind(blockModel)),
    concurrent(5)
  );
};

const blockModel = mongoose.model<BlockSchema, BlockModel>(
  'Block',
  blockSchema
);

export default blockModel;
