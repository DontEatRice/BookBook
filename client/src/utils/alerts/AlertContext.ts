/* eslint-disable @typescript-eslint/no-empty-function */
import { AlertColor } from '@mui/material/Alert';
import { createContext } from 'react';

export type AlertBody = {
  title?: string;
  message: string;
};

export type AlertProps = {
  body: AlertBody;
  severity: AlertColor;
};

interface IAlertContext {
  showError: (body: AlertBody) => void;
  showSuccess: (body: AlertBody) => void;
  showInfo: (body: AlertBody) => void;
  showWarning: (body: AlertBody) => void;
  handleError: (error: unknown) => void;
  alertNotification: AlertProps | null;
  clearNotification: () => void;
}

export const AlertContext = createContext<IAlertContext>({
  showSuccess: () => {},
  showInfo: () => {},
  showWarning: () => {},
  showError: () => {},
  alertNotification: null,
  clearNotification: () => {},
  handleError: () => {},
});
