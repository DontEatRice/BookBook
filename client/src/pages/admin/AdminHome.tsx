import Typography from '@mui/material/Typography';
import AuthorizedView from '../../components/auth/AuthorizedView';
import { Box, Button } from '@mui/material';
import NotAuthorizedView from '../../components/auth/NotAuthorizedView';

function AdminHome() {
  return (
    <>
      <AuthorizedView>
        <Box textAlign={'center'}>
          <Typography variant="h5" sx={{ marginTop: 3 }}>
            Witamy w panelu administracyjnym!
          </Typography>
        </Box>
      </AuthorizedView>
      <NotAuthorizedView>
        <Box textAlign={'center'} flexDirection={'column'}>
          <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 2 }}>
            Zaloguj się w celu zarządzania zasobami
          </Typography>
          <Button href="/login" variant="contained">
            Logowanie
          </Button>
        </Box>
      </NotAuthorizedView>
    </>
  );
}

export default AdminHome;
