import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container>
      <Typography variant="h1">Welcome Home!</Typography>
      <Link component={RouterLink} to={`/examples`}>
        Examples
      </Link>
    </Container>
  );
}

export default Home;
