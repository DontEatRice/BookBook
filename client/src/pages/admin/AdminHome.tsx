import Typography from '@mui/material/Typography';
import AuthorizedView from '../../components/auth/AuthorizedView';
import NotAuthorizedView from '../../components/auth/NotAuthorizedView';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { loginWithReturnToPath } from '../../utils/utils';

function AdminHome() {
  return (
    <>
      <AuthorizedView>
        <Box textAlign={'center'}>
          <Typography variant="h5" sx={{ marginTop: 3 }}>
            Witamy w panelu administracyjnym!
          </Typography>
          <Typography variant="h5" sx={{ marginTop: 3 }}>
            Przejdź do odpowiedniej zakładki korzystając z menu po prawej stronie
          </Typography>
        </Box>
      </AuthorizedView>
      <NotAuthorizedView>
        <Box textAlign={'center'} flexDirection={'column'}>
          <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
            Zaloguj się w celu zarządzania zasobami
          </Typography>
          <Button variant="contained" component={Link} to={loginWithReturnToPath(window.location.pathname)}>
            Logowanie
          </Button>
        </Box>
      </NotAuthorizedView>
    </>
  );
}

export default AdminHome;
