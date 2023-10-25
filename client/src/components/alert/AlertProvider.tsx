import { ReactNode } from 'react';
import { AlertContext } from '../../utils/alerts/AlertContext';

function AlertProvider({ children }: { children?: ReactNode }) {
  // notistack

  return <AlertContext.Provider value={}>{children}</AlertContext.Provider>;
}
