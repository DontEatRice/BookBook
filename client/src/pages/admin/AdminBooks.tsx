import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { useState, MouseEvent, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';
import { BookViewModelType } from '../../models/BookViewModel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

// przyklad z https://mui.com/material-ui/react-table/#sorting-amp-selecting

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof BookViewModelType>(
  order: Order,
  orderBy: Key
): (a: BookViewModelType, b: BookViewModelType) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof BookViewModelType;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Id',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Tytuł',
  },
  {
    id: 'yearPublished',
    numeric: true,
    disablePadding: true,
    label: 'Rok Opublikowania',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof BookViewModelType) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableProps) {
  const createSortHandler = (property: keyof BookViewModelType) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} */}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const data: BookViewModelType[] = [
  {
    id: '0010-2000',
    authors: [],
    isbn: '124343',
    yearPublished: 2019,
    bookCategories: [],
    title: 'Biblia',
    publisher: { id: 'dupa', name: 'Wydawca obiadów', description: "Fajna ksiazka" },
  },
  {
    id: '0010-2001',
    authors: [],
    isbn: '624344',
    yearPublished: 1337,
    bookCategories: [],
    title: 'Książe Nieporządek',
    publisher: { id: 'dupa', name: 'Wydawca obiadów', description: null },
  },
  {
    id: '0010-2002',
    authors: [],
    isbn: '724345',
    yearPublished: 2024,
    bookCategories: [],
    title: 'Harry Pothead',
    publisher: { id: 'dupa', name: 'Wydawca obiadów', description: null },
  },
];

function AdminBooks() {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof BookViewModelType>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof BookViewModelType) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  //Tutaj powinna też być paginacja
  const visibleRows = useMemo(() => data.sort(getComparator(order, orderBy)), [order, orderBy]);

  return (
    <Box mt={1}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Książki</Typography>
        </Grid>
        <Grid item>
          <Link to="/admin/books/add">
            <Button variant="contained">Dodaj książkę</Button>
          </Link>
        </Grid>
      </Grid>
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <EnhancedTableHead order={order} onRequestSort={handleRequestSort} orderBy={orderBy} />
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                hover
                // onClick={(event) => handleClick(event, row.name)}
                role="checkbox"
                tabIndex={-1}
                key={row.id}
                sx={{ cursor: 'pointer' }}>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="right">{row.yearPublished}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        // count={rows.length}
        count={100}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, page) => setPage(page)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
}

export default AdminBooks;
