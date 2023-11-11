import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AlertBody, AlertContext, AlertProps } from '../../utils/alerts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { ApiResponseError, ValidationApiError } from '../../utils/utils';
import { translateErrorCode } from '../../utils/functions/utilFunctions';

function AlertProvider({ children }: { children?: ReactNode }) {
  const query = useQueryClient();
  const [alertNotification, setAlertNotification] = useState<AlertProps | null>(null);

  const showWarning = (body: AlertBody) => {
    setAlertNotification({ body, severity: 'warning' });
  };
  const showSuccess = (body: AlertBody) => {
    setAlertNotification({ body, severity: 'success' });
  };
  const showError = (body: AlertBody) => {
    setAlertNotification({ body, severity: 'error' });
  };
  const showInfo = (body: AlertBody) => {
    setAlertNotification({ body, severity: 'info' });
  };
  const clearNotification = () => {
    setAlertNotification(null);
  };

  const handleError = (error: unknown) => {
    if (error instanceof ApiResponseError) {
      showError({ title: 'Wystąpił błąd', message: translateErrorCode(error.error.code) });
    } else if (error instanceof ValidationApiError) {
      showError({ title: 'Wystąpił błąd w danych', message: error.validationError.title });
    } else {
      console.error(error);
      showError({ message: 'Wystąpił nieoczekiwany błąd' });
    }
  };

  useEffect(() => {
    const defaultOptions = query.getDefaultOptions();
    query.setDefaultOptions({
      queries: {
        ...defaultOptions.queries,
        onError: handleError,
      },
      mutations: {
        ...defaultOptions.mutations,
        onError: handleError,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const values = useMemo(
    () => ({
      showWarning,
      alertNotification,
      clearNotification,
      handleError,
      showError,
      showInfo,
      showSuccess,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alertNotification]
  );

  return <AlertContext.Provider value={values}>{children}</AlertContext.Provider>;
}

export default AlertProvider;
