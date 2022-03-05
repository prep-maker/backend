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
    .notEmpty()
    .withMessage('블록 타입을 입력해주세요.')
    .isString()
    .trim()
    .isIn(['P', 'R', 'E', 'PR', 'RE', 'EP', 'PRE', 'REP', 'PREP'])
    .withMessage({
      message:
        'block 타입은 P, R, E, PR, RE, EP, PRE, REP, PREP 중에 하나여야 합니다.',
      status: 400,
    }),
  body('paragraphs').isArray().withMessage({
    message: 'paragraphs는 배열이어야 합니다.',
    status: 400,
  }),
];

export const signinBodyChain = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage({ message: 'email을 입력해주세요.', status: 400 })
    .normalizeEmail()
    .isEmail()
    .withMessage({ message: '잘못된 이메일 형식입니다.', status: 400 }),
  body('password')
    .isString()
    .withMessage({ message: '비밀번호는 문자열이어야 합니다.', status: 400 })
    .trim()
    .notEmpty()
    .withMessage({ message: '비밀번호를 입력해주세요.', status: 400 })
    .isLength({ min: 6, max: 20 })
    .withMessage({
      message: '비밀번호는 6자 이상 20자 이하여야 합니다.',
      status: 400,
    }),
];

export const signupBodyChain = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage({ message: 'email을 입력해주세요.', status: 400 })
    .normalizeEmail()
    .isEmail()
    .withMessage({ message: '잘못된 이메일 형식입니다.', status: 400 }),
  body('name')
    .isString()
    .withMessage({ message: 'name은 문자열이어야 합니다.', status: 400 })
    .trim()
    .notEmpty()
    .withMessage({ message: 'name을 입력해주세요.', status: 400 })
    .isLength({ max: 10 })
    .withMessage({ message: '이름은 10자 이하여야 합니다.', status: 400 }),
  body('password')
    .isString()
    .withMessage({ message: '비밀번호는 문자열이어야 합니다.', status: 400 })
    .trim()
    .notEmpty()
    .withMessage({ message: '비밀번호를 입력해주세요.', status: 400 })
    .isLength({ min: 6, max: 20 })
    .withMessage({
      message: '비밀번호는 6자 이상 20자 이하여야 합니다.',
      status: 400,
    }),
];
