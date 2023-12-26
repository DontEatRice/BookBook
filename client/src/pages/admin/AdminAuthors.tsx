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
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { useQuery } from '@tanstack/react-query';
import { AuthorSearchResponse, getAuthors } from '../../api/author';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import LoadingTypography from '../../components/common/LoadingTypography';
import { imgUrl } from '../../utils/utils';
import { z } from 'zod';
import { PaginatedTableHeadCell, PaginatedTableProps, PaginationRequest } from '../../utils/constants';
import { TablePagination, TableSortLabel } from '@mui/material';
import { useState } from 'react';

type ResponseType = z.infer<typeof AuthorSearchResponse>;
const headCells: readonly PaginatedTableHeadCell<AuthorViewModelType>[] = [
  { field: 'id', label: 'Id', numeric: false, sortable: false },
  { field: 'profilePictureUrl', label: 'Zdjęcie', numeric: false, sortable: false },
  { field: 'firstName', label: 'Imię', numeric: false, sortable: true },
  { field: 'lastName', label: 'Nazwisko', numeric: false, sortable: true },
  { field: 'birthYear', label: 'Rok urodzenia', numeric: true, sortable: true },
];

function AuthorsTable({
  data,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: PaginatedTableProps<ResponseType, AuthorViewModelType>) {
  const navigate = useNavigate();
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
            {data.data.map((author) => (
              <TableRow
                onClick={() => navigate(`./${author.id}`)}
                key={author.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}>
                <TableCell>{author.id}</TableCell>
                <TableCell>
                  <Avatar src={imgUrl(author.profilePictureUrl) ?? undefined} />
                </TableCell>
                <TableCell>{author.firstName}</TableCell>
                <TableCell>{author.lastName}</TableCell>
                <TableCell>{author.birthYear}</TableCell>
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

function AdminAuthors() {
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);

  const { data, status, isLoading } = useQuery({
    queryKey: ['authors', pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () => getAuthors(paginationProps),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
  });

  const handleRequestSort = (property: keyof AuthorViewModelType) => {
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
          <Typography variant="h4">Autorzy</Typography>
        </Grid>
        <Grid item>
          <Link to="add">
            <Button variant="contained">Dodaj autora</Button>
          </Link>
        </Grid>
      </Grid>
      {isInitLoading && isLoading && <LoadingTypography />}
      {status == 'success' && (
        <AuthorsTable
          data={data}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminAuthors;
