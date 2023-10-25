import { useContext } from 'react';
import { AlertContext } from './AlertContext';

export default function useAlert() {
  return useContext(AlertContext);
}
