import { body } from 'express-validator';

export const writingBodyChain = [
  body('title')
    .trim()
    .isString()
    .withMessage({ message: 'title은 문자열이어야 합니다.', status: 400 })
    .isLength({ max: 100 })
    .withMessage('title은 100글자 이하여야 합니다.'),
  body('isDone')
    .isBoolean()
    .withMessage({ message: 'isDone은 boolean이어야 합니다.', status: 400 }),
  body('blocks').not().exists().withMessage({
    message:
      'blocks 프로퍼티는 입력이 불가합니다. blocks 업데이트는 PUT /users/:id/writings/:id/blocks를 이용해야 합니다.',
    status: 400,
  }),
];
