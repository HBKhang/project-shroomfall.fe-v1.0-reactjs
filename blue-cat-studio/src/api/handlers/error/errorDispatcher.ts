import { handleValidationError } from './errorHandler';
import type { AxiosError } from 'axios';
import type { ApiErrorDTO } from '../../../contracts/dto/abstraction/api-error-dto';

export const dispatchApiError = (error: AxiosError<ApiErrorDTO>): void => {
  const errorData = error.response?.data;
  handleValidationError(errorData);
};