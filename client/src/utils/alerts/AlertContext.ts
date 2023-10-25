/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

type AlertBody = {
  title?: string;
  message: string;
  autoclose?: boolean;
};

interface IAlertContext {
  showError: (body: AlertBody) => void;
  showSuccess: (body: AlertBody) => void;
  showInfo: (body: AlertBody) => void;
  showWarning: (body: AlertBody) => void;
}

export const AlertContext = createContext<IAlertContext>({
  showSuccess: () => {},
  showInfo: () => {},
  showWarning: () => {},
  showError: () => {},
});
