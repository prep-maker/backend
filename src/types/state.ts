type SuccessState<T> = {
  state: 'success';
  data: T;
};

type ErrorState = {
  state: 'fail';
  reason: 'duplicate' | 'unknown';
  error?: Error;
};

type ResultState<T> = SuccessState<T> | ErrorState;
