import { param } from 'express-validator';
import { ERROR } from '../../common/constants/error.js';
import { BlockDocument } from '../../common/types/block.js';
import { UserDocument } from '../../common/types/user.js';
import { WritingDocument } from '../../common/types/writing.js';
import blockModel from '../../models/block.js';
import userModel from '../../models/user.js';
import writingModel from '../../models/writing.js';

export const userIdChain = [
  param('userId')
    .isMongoId()
    .withMessage({ message: ERROR.INVALID_USER_ID, status: 400 })
    .custom(async (id: string) => {
      let user: UserDocument | null;
      try {
        user = await userModel.findById(id);
      } catch (error) {
        console.error(error);
        throw error;
      }

      if (user) {
        return true;
      }

      throw { message: ERROR.NOT_FOUND_USER, status: 404 };
    }),
];

export const writingIdChain = [
  param('writingId')
    .isMongoId()
    .withMessage({ message: ERROR.INVALID_WRITING_ID, status: 400 })
    .custom(async (id: string) => {
      let writing: WritingDocument | null;
      try {
        writing = await writingModel.findById(id);
      } catch (error) {
        console.error(error);
        throw error;
      }

      if (writing) {
        return true;
      }

      throw { message: ERROR.NOT_FOUND_WRITING, status: 404 };
    }),
];

export const blockIdChain = [
  param('blockId')
    .isMongoId()
    .withMessage({ message: ERROR.INVALID_BLOCK_ID, status: 400 })
    .custom(async (id: string) => {
      let block: BlockDocument | null;
      try {
        block = await blockModel.findById(id);
      } catch (error) {
        console.error(error);
        throw error;
      }

      if (block) {
        return true;
      }

      throw { message: ERROR.NOT_FOUND_BLOCK, status: 404 };
    }),
];
