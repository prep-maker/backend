import { body } from 'express-validator';

export const writingBodyChain = [
  body('title')
    .isString()
    .trim()
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

export const blockBodyChain = [
  body('type')
    .isString()
    .trim()
    .isIn(['P', 'R', 'E', 'PR', 'RE', 'EP', 'PRE', 'REP', 'PREP'])
    .withMessage(
      'block 타입은 P, R, E, PR, RE, EP, PRE, REP, PREP 중에 하나여야 합니다.'
    ),
  body('paragraph').isArray().equals,
];

export const signinBodyChain = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email을 입력해주세요.')
    .normalizeEmail()
    .isEmail()
    .withMessage('잘못된 이메일 형식입니다.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .isString()
    .withMessage('비밀번호는 문자열이어야 합니다.')
    .isLength({ min: 6, max: 20 })
    .withMessage('비밀번호는 6자 이상 20자 이하여야 합니다.'),
];

export const signupBodyChain = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email을 입력해주세요.')
    .normalizeEmail()
    .isEmail()
    .withMessage('잘못된 이메일 형식입니다.'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name을 입력해주세요.')
    .isString()
    .withMessage('name은 문자열이어야 합니다.')
    .isLength({ max: 10 })
    .withMessage('이름은 10자 이하여야 합니다.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
    .isString()
    .withMessage('비밀번호는 문자열이어야 합니다.')
    .isLength({ min: 6, max: 20 })
    .withMessage('비밀번호는 6자 이상 20자 이하여야 합니다.'),
];
