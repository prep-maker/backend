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

const blockModel = mongoose.model<BlockSchema, BlockModel>(
  'block',
  blockSchema
);

export default blockModel;
