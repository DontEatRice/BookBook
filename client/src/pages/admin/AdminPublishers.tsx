import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { PublisherViewModelType } from '../../models/PublisherViewModel';
import { useQuery } from '@tanstack/react-query';
import { getPublishers } from '../../api/publisher';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';

function PublishersTable({ data }: { data: PublisherViewModelType[] }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Wydawca</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((publisher) => (
            <TableRow key={publisher.id}>
              <TableCell>{publisher.id}</TableCell>
              <TableCell>{publisher.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminPublishers() {
  const theme = useTheme();
  const { data, status } = useQuery({ queryKey: ['publishers'], queryFn: getPublishers });

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Wydawcy</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj wydawcę</Button>
          </Link>
        </Grid>
      </Grid>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <PublishersTable data={data} />}
    </Box>
  );
}

export default AdminPublishers;
