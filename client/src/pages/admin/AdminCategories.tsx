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
import Table from '@mui/material/Table';
import { BookCategorySearchResponse, getCategories } from '../../api/category';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import { z } from 'zod';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import TableSortLabel from '@mui/material/TableSortLabel';
import { PaginatedTableHeadCell, PaginatedTableProps, PaginationRequest } from '../../utils/constants';
import LoadingTypography from '../../components/common/LoadingTypography';

type ResponseType = z.infer<typeof BookCategorySearchResponse>;

const headCells: readonly PaginatedTableHeadCell<BookCategoryViewModelType>[] = [
  { field: 'name', label: 'Nazwa', numeric: false, sortable: true },
  { field: 'id', label: 'Id', numeric: false, sortable: false },
];

function BookCategoriesTable({
  data,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: PaginatedTableProps<ResponseType, BookCategoryViewModelType>) {
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const navigate = useNavigate();

  const handleChangePage = (_: React.MouseEvent | null, newPage: number) => {
    onPaginationPropsChange({ ...paginationProps, pageNumber: newPage });
  };
  const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationPropsChange({ ...paginationProps, pageSize: parseInt(event.target.value, 10) });
  };
  return (
    <Box sx={sx}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((cell) => (
                <TableCell
                  key={cell.field}
                  sortDirection={orderByField === cell.field ? orderDirection : 'desc'}>
                  {cell.sortable ? (
                    <TableSortLabel
                      active={orderByField === cell.field}
                      direction={orderByField === cell.field ? orderDirection : 'asc'}
                      onClick={() => onRequestSort(cell.field)}>
                      {cell.label}
                    </TableSortLabel>
                  ) : (
                    cell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((category) => (
              <TableRow
                onClick={() => navigate(`./${category.id}`)}
                key={category.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component={'div'}
        rowsPerPage={pageSize}
        count={data.count}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsChange}
        labelRowsPerPage={'Ilość na stronie'}
        labelDisplayedRows={({ from, to, count }) => {
          return `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`;
        }}
      />
    </Box>
  );
}

function AdminBookCategories() {
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);

  const { data, status, isLoading } = useQuery({
    queryKey: ['categories', pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () => getCategories(paginationProps),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
  });
  const handleRequestSort = (property: keyof BookCategoryViewModelType) => {
    const isAsc = orderByField === property && orderDirection === 'asc';
    setPaginationProps({
      ...paginationProps,
      orderByField: property,
      orderDirection: isAsc ? 'desc' : 'asc',
    });
  };

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
      {isInitLoading && isLoading && <LoadingTypography />}
      {status == 'success' && (
        <BookCategoriesTable
          data={data}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminBookCategories;
