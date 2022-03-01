export const useFailState = (
  message: FailState['message'],
  status = 500
): FailState => {
  return { state: 'fail', message, status };
};

export const useSuccessState = <T>(data: T): SuccessState<T> => {
  return { state: 'success', data };
};

export const useErrorState = (error: Error): ErrorState => {
  return { state: 'error', error, status: 500 };
};
