import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { useQuery } from '@tanstack/react-query';
import { getAuthors } from '../../api/author';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';

function AuthorsTable({ data }: { data: AuthorViewModelType[] }) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Imię</TableCell>
            <TableCell>Nazwisko</TableCell>
            <TableCell>Rok urodzenia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((author) => (
            <TableRow key={author.id} onClick={() => navigate(`/admin/authors/${author.id}`)}>
              <TableCell>{author.id}</TableCell>
              <TableCell>{author.firstName}</TableCell>
              <TableCell>{author.lastName}</TableCell>
              <TableCell>{author.birthYear}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminAuthors() {
  const theme = useTheme();
  const { data, status } = useQuery({
    queryKey: ['authors'],
    queryFn: () => getAuthors({ pageNumber: 0, pageSize: 50 }),
  });

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Autorzy</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj autora</Button>
          </Link>
        </Grid>
      </Grid>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <AuthorsTable data={data.data} />}
    </Box>
  );
}

export default AdminAuthors;
