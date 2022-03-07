import { concurrent, map, pipe, toArray, toAsync } from '@fxts/core';
import mongoose, { Schema } from 'mongoose';
import {
  BlockDocument,
  BlockModel,
  BlockResponse,
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
  paragraphs: {
    type: [paragraphSchema],
  },
});

blockSchema.statics.deleteByIds = async function (
  ids: readonly ObjectId[] | readonly string[]
): Promise<void> {
  await pipe(
    ids,
    toAsync,
    map(this.findByIdAndRemove.bind(blockModel)),
    concurrent(5),
    toArray
  );
};

blockSchema.statics.createBlocks = async function (
  blocks: BlockSchema[]
): Promise<BlockResponse[]> {
  const create = async (block: BlockSchema) => {
    const document: BlockDocument = new this(block);
    await document.save();
    const newBlock = document.toObject();

    return { ...newBlock, id: newBlock._id };
  };

  const result: BlockResponse[] = await pipe(
    blocks,
    toAsync,
    map(create.bind(blockModel)),
    toArray
  );

  return result;
};

const blockModel = mongoose.model<BlockSchema, BlockModel>(
  'Block',
  blockSchema
);

export default blockModel;
