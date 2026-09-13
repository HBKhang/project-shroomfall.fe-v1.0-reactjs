import { toastBus } from './errorEvent';
import type { ApiErrorDTO } from '../../../contracts/dto/common/api-error-dto';

export const handleValidationError = (errorData: ApiErrorDTO | string | undefined): void => {
  if (errorData && typeof errorData === 'object') {
    toastBus.emitError(errorData);
    return;
  }

  if (typeof errorData === 'string') {
    const rawStringPayload: ApiErrorDTO = {
      type: 'API Error',
      code: errorData || 'EMPTY_RESPONSE',
      message: errorData || 'The server returned an empty response body.',
      details: 'Raw string response intercepted from the network stream.'
    };
    
    toastBus.emitError(rawStringPayload);
    return;
  }

  const fallbackError: ApiErrorDTO = {
    type: 'Bad Request',
    code: 'api.unreachable',
    message: 'Could not connect to service pipeline.',
    details: 'The server response payload was missing or empty.',
  };

  toastBus.emitError(fallbackError);
};