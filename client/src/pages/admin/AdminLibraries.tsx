import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { getLibraries } from '../../api/library';
import LoadingTypography from '../../components/common/LoadingTypography';

function LibrariesTable({ data }: { data: LibraryViewModelType[] }) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nazwa</TableCell>
            <TableCell>Miejscowość</TableCell>
            <TableCell>Ulica</TableCell>
            <TableCell>Numer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((library) => (
            <TableRow
              key={library.id}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/admin/libraries/${library.id}`)}>
              <TableCell>{library.name}</TableCell>
              <TableCell>{library.address.city}</TableCell>
              <TableCell>{library.address.street}</TableCell>
              <TableCell>{library.address.number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminLibraries() {
  const theme = useTheme();
  const { data, status } = useQuery({
    queryKey: ['libraries'],
    queryFn: () => getLibraries({ pageNumber: 0, pageSize: 50 }),
  });

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Biblioteki</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj bibliotekę</Button>
          </Link>
        </Grid>
      </Grid>
      {status == 'loading' && <LoadingTypography />}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <LibrariesTable data={data.data} />}
    </Box>
  );
}

export default AdminLibraries;
