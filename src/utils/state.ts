export const createErrorState = (
  message: ErrorState['message'],
  error?: Error
): ErrorState => {
  return { state: 'fail', message, error };
};

export const createSuccessState = <T>(data: T): SuccessState<T> => {
  return { state: 'success', data };
};

export const createError = (result: ErrorState) => {
  return result.message === 'unknown'
    ? result.error
    : new Error(result.message);
};
