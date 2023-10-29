import Snackbar from '@mui/material/Snackbar';
import useAlert from '../../utils/alerts/useAlert';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Slide from '@mui/material/Slide';
import { useEffect, useState } from 'react';
import { AlertProps } from '../../utils/alerts/AlertContext';

function AlertBar() {
  const { alertNotification, clearNotification } = useAlert();
  const [queue, setQueue] = useState<AlertProps[]>([]);
  const [activeAlert, setActiveAlert] = useState<AlertProps | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    // setActiveAlert(null);
    setOpen(false);
  };

  useEffect(() => {
    if (alertNotification === null) {
      return;
    }
    if (!open && activeAlert === null && queue.length == 0) {
      setActiveAlert({ ...alertNotification });
      setOpen(true);
      clearNotification();
    } else {
      setQueue([...queue, { ...alertNotification }]);
      clearNotification();
    }
  }, [activeAlert, alertNotification, open, queue, clearNotification]);

  const handleExit = () => {
    setActiveAlert(null);
    if (queue.length >= 0) {
      setActiveAlert(queue.shift()!);
      setQueue([...queue]);
      setOpen(true);
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
      TransitionProps={{ onExited: handleExit }}>
      <Alert severity={activeAlert?.severity} variant="filled">
        {activeAlert?.body.title && <AlertTitle>{activeAlert.body.title}</AlertTitle>}
        {activeAlert?.body.message}
      </Alert>
    </Snackbar>
  );
}

export default AlertBar;
