type SuccessState<T> = {
  state: 'success';
  data: T;
};

type FailState = {
  state: 'fail';
  message: string;
  status: number;
};

type ErrorState = {
  state: 'error';
  error: Error;
  status: number;
};

type ResultState<T> = SuccessState<T> | FailState | ErrorState;
type BadState = FailState | ErrorState;
