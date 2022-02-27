import { body } from 'express-validator';

const signinChain = [
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

export default signinChain;
