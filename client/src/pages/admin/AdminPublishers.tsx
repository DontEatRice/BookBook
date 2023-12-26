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
import { PublisherViewModelType } from '../../models/PublisherViewModel';
import { useQuery } from '@tanstack/react-query';
import { PublisherSearchResponse, getPublishers } from '../../api/publisher';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import LoadingTypography from '../../components/common/LoadingTypography';
import { z } from 'zod';
import { PaginatedTableHeadCell, PaginatedTableProps, PaginationRequest } from '../../utils/constants';
import { TablePagination, TableSortLabel } from '@mui/material';
import { useState } from 'react';

type ResponseType = z.infer<typeof PublisherSearchResponse>;
const headCells: readonly PaginatedTableHeadCell<PublisherViewModelType>[] = [
  { field: 'id', label: 'Id', numeric: false, sortable: false },
  { field: 'name', label: 'Nazwa', numeric: false, sortable: true },
];

function PublishersTable({
  data,
  paginationProps,
  onPaginationPropsChange,
  onRequestSort,
  sx,
}: PaginatedTableProps<ResponseType, PublisherViewModelType>) {
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
            {data.data.map((publisher) => (
              <TableRow
                key={publisher.id}
                onClick={() => navigate(`./publishers/${publisher.id}`)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}>
                <TableCell>{publisher.id}</TableCell>
                <TableCell>{publisher.name}</TableCell>
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

function AdminPublishers() {
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);
  const theme = useTheme();

  const handleRequestSort = (property: keyof PublisherViewModelType) => {
    const isAsc = orderByField === property && orderDirection === 'asc';
    setPaginationProps({
      ...paginationProps,
      orderByField: property,
      orderDirection: isAsc ? 'desc' : 'asc',
    });
  };

  const { data, status, isLoading } = useQuery({
    queryKey: ['publishers', pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () => getPublishers(paginationProps),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
  });

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
      {isInitLoading && isLoading && <LoadingTypography />}
      {status == 'error' && (
        <Typography variant="h3" color={theme.palette.error.main}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && (
        <PublishersTable
          data={data}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminPublishers;
