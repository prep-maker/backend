import { useErrorState } from './state.js';

const catchError = async <T>(
  callback: () => Promise<T>
): Promise<T | ErrorState> => {
  try {
    const result = await callback();

    return result;
  } catch (error) {
    return useErrorState(error as Error);
  }
};

export default catchError;
