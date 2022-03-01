import { Document, Model } from 'mongoose';

export type ParagraphSchema = {
  type: 'P' | 'R' | 'E';
  content: string;
};

export type BlockSchema = {
  readonly type: 'P' | 'R' | 'E' | 'PR' | 'RE' | 'EP' | 'PRE' | 'REP' | 'PREP';
  readonly canMerge: boolean;
  readonly paragraphs: ParagraphSchema[];
};

export interface BlockDocument extends BlockSchema, Document {}

export type BlockModel = Model<BlockDocument>;
