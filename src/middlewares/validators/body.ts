import { body } from 'express-validator';
import { BLOCK_TYPE } from '../../common/constants/blocks.js';
import { ERROR } from '../../common/constants/error.js';

export const writingBodyChain = [
  body('title')
    .isString()
    .trim()
    .withMessage({ message: ERROR.TITLE_STRING_REQUIRED, status: 400 })
    .isLength({ max: 100 })
    .withMessage(ERROR.TITLE_RANGE),
  body('isDone')
    .isBoolean()
    .withMessage({ message: ERROR.IS_DONE_BOOL_REQUIRED, status: 400 }),
  body('blocks').not().exists().withMessage({
    message: ERROR.BLOCKS_EXISTING,
    status: 400,
  }),
];

export const blockBodyChain = [
  body('type')
    .notEmpty()
    .withMessage(ERROR.BLOCK_TYPE_REQUIRED)
    .isString()
    .trim()
    .isIn(Object.keys(BLOCK_TYPE))
    .withMessage({
      message: ERROR.BLOCK_TYPE,
      status: 400,
    }),
  body('paragraphs').isArray().withMessage({
    message: ERROR.PARAGRAPHS_ARRAY_REQUIRED,
    status: 400,
  }),
];

export const blockListBodyChain = [
  body()
    .notEmpty()
    .withMessage({
      message: ERROR.BLOCK_LIST_REQUIRED,
      status: 400,
    })
    .isArray()
    .withMessage({ message: ERROR.BLOCKS_ARRAY_REQUIRED, status: 400 })
    .custom((blocks) => {
      for (const block of blocks) {
        if (!block.type) {
          throw { message: ERROR.NO_BLOCK_TYPE, status: 400 };
        }

        if (!Object.keys(BLOCK_TYPE).includes(block.type)) {
          throw {
            message: ERROR.BLOCK_TYPE,
            status: 400,
          };
        }

        return true;
      }
    }),
];

export const signinBodyChain = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage({ message: ERROR.EMAIL_REQUIRED, status: 400 })
    .isEmail()
    .withMessage({ message: ERROR.INVALID_EMAIL, status: 400 }),
  body('password')
    .isString()
    .withMessage({ message: ERROR.PASSWORD_STRING_REQUIRED, status: 400 })
    .trim()
    .notEmpty()
    .withMessage({ message: ERROR.PASSWORD_REQUIRED, status: 400 })
    .isLength({ min: 6, max: 20 })
    .withMessage({
      message: ERROR.PASSWORD_RANGE,
      status: 400,
    }),
];

export const signupBodyChain = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage({ message: ERROR.EMAIL_REQUIRED, status: 400 })
    .isEmail()
    .withMessage({ message: ERROR.INVALID_EMAIL, status: 400 }),
  body('name')
    .isString()
    .withMessage({ message: ERROR.NAME_STRING_REQUIRED, status: 400 })
    .trim()
    .notEmpty()
    .withMessage({ message: ERROR.NAME_REQUIRED, status: 400 })
    .isLength({ max: 20 })
    .withMessage({ message: ERROR.NAME_RANGE, status: 400 }),
  body('password')
    .isString()
    .withMessage({ message: ERROR.PASSWORD_STRING_REQUIRED, status: 400 })
    .trim()
    .notEmpty()
    .withMessage({ message: ERROR.PASSWORD_REQUIRED, status: 400 })
    .isLength({ min: 6, max: 20 })
    .withMessage({
      message: ERROR.PASSWORD_RANGE,
      status: 400,
    }),
];
