import { ReactNode, useMemo, useState } from 'react';
import { AlertBody, AlertContext, AlertProps } from '../../utils/alerts/AlertContext';

function AlertProvider({ children }: { children?: ReactNode }) {
  const [alertNotification, setAlertNotification] = useState<AlertProps | null>(null);

  const showWarning = (body: AlertBody) => {
    setAlertNotification({ body, severity: 'warning' });
  };
  const clearNotification = () => {
    setAlertNotification(null);
  };

  const values = useMemo(
    () => ({
      showWarning,
      alertNotification,
      clearNotification,
    }),
    [alertNotification]
  );

  return <AlertContext.Provider value={values}>{children}</AlertContext.Provider>;
}

export default AlertProvider;
