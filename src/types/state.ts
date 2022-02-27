type SuccessState<T> = {
  state: 'success';
  data: T;
};

type ErrorMessage =
  | '이미 존재하는 이메일입니다.'
  | '유저를 찾을 수 없습니다.'
  | '이메일 혹은 비밀번호가 잘못되었습니다.'
  | 'unknown';

type ErrorState = {
  state: 'fail';
  message: ErrorMessage;
  error?: Error;
};

type ResultState<T> = SuccessState<T> | ErrorState;
