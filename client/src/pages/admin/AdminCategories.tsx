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
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import { getCategories } from '../../api/category';

function BookCategoriesTable({ data }: { data: BookCategoryViewModelType[] }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Nazwa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminBookCategories() {
  const theme = useTheme();
  const { data, status } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Kategorie</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj kategorię</Button>
          </Link>
        </Grid>
      </Grid>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <BookCategoriesTable data={data} />}
    </Box>
  );
}

export default AdminBookCategories;
