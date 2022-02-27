export const createFailState = (
  message: FailState['message'],
  status = 500
): FailState => {
  return { state: 'fail', message, status };
};

export const createSuccessState = <T>(data: T): SuccessState<T> => {
  return { state: 'success', data };
};

export const createErrorState = (error: Error): ErrorState => {
  return { state: 'error', error, status: 500 };
};
