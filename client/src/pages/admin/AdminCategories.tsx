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
import { useQuery } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import { BookCategorySearchResponse, getCategories } from '../../api/category';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import { z } from 'zod';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import TableSortLabel from '@mui/material/TableSortLabel';
import { SxProps, Theme } from '@mui/material/styles';
import { PaginationRequest } from '../../utils/constants';

type ResponseType = z.infer<typeof BookCategorySearchResponse>;
interface BookCategoriesTableProps {
  data: ResponseType;
  paginationProps: PaginationRequest;
  onPaginationPropsChange: (args: PaginationRequest) => void;
  onRequestSort: (field: keyof BookCategoryViewModelType) => void;
  sx?: SxProps<Theme>;
}

interface HeadCell<T> {
  field: keyof T;
  label: string;
  sortable: boolean;
  numeric: boolean;
}

const headCells: readonly HeadCell<BookCategoryViewModelType>[] = [
  { field: 'id', label: 'Id', numeric: false, sortable: false },
  { field: 'name', label: 'Nazwa', numeric: false, sortable: true },
];

function BookCategoriesTable({
  data,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: BookCategoriesTableProps) {
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
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
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
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
      {isInitLoading && isLoading && <Typography variant="h3">Ładowanie...</Typography>}
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
