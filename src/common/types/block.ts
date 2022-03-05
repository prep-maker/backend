import { Document, Model } from 'mongoose';
import { ObjectId } from './mongoose';

export type ParagraphSchema = {
  type: 'P' | 'R' | 'E';
  content: string;
};

export type BlockSchema = {
  readonly type: 'P' | 'R' | 'E' | 'PR' | 'RE' | 'EP' | 'PRE' | 'REP' | 'PREP';
  readonly paragraphs: ParagraphSchema[];
};

export interface BlockDocument extends BlockSchema, Document {}

export interface BlockRepository {
  deleteByIds: (ids: readonly ObjectId[]) => Promise<void>;
  create: (block: BlockSchema) => Promise<BlockDocument>;
}

export type BlockModel = Model<BlockDocument> & BlockRepository;
