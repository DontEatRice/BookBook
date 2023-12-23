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
import { LibrariesSearchResponse, getLibraries } from '../../api/library';
import LoadingTypography from '../../components/common/LoadingTypography';
import { z } from 'zod';
import { PaginatedTableProps, PaginationRequest } from '../../utils/constants';
import { TablePagination, TableSortLabel } from '@mui/material';
import { useState } from 'react';

type ResponseType = z.infer<typeof LibrariesSearchResponse>;

function LibrariesTable({
  data,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: PaginatedTableProps<ResponseType, LibraryViewModelType>) {
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
              <TableCell sortDirection={orderByField === 'name' ? orderDirection : 'desc'}>
                <TableSortLabel
                  active={orderByField === 'name'}
                  direction={orderByField === 'name' ? orderDirection : 'asc'}
                  onClick={() => onRequestSort('name')}>
                  Nazwa
                </TableSortLabel>
              </TableCell>
              <TableCell>Miejscowość</TableCell>
              <TableCell>Ulica</TableCell>
              <TableCell>Numer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((library) => (
              <TableRow
                key={library.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}
                onClick={() => navigate(`./libraries/${library.id}`)}>
                <TableCell>{library.name}</TableCell>
                <TableCell>{library.address.city}</TableCell>
                <TableCell>{library.address.street}</TableCell>
                <TableCell>{library.address.number}</TableCell>
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

function AdminLibraries() {
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);
  const handleRequestSort = (property: keyof LibraryViewModelType) => {
    const isAsc = orderByField === property && orderDirection === 'asc';
    setPaginationProps({
      ...paginationProps,
      orderByField: property,
      orderDirection: isAsc ? 'desc' : 'asc',
    });
  };

  const theme = useTheme();
  const { data, status, isLoading } = useQuery({
    queryKey: ['libraries', pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () => getLibraries(paginationProps),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
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
      {isInitLoading && isLoading && <LoadingTypography />}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && (
        <LibrariesTable
          data={data}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminLibraries;
