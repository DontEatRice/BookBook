import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import { z } from 'zod';
import TableSortLabel from '@mui/material/TableSortLabel';
import { SxProps, Theme } from '@mui/material/styles';
import { PaginationRequest } from '../../utils/constants';
import LoadingTypography from '../../components/common/LoadingTypography';
import { UserSearchPaginated, getUsers, makeUserCritic } from '../../api/user';
import { AdminUserViewModelType } from '../../models/user/AdminUserViewModel';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { imgUrl } from '../../utils/utils';

type ResponseType = z.infer<typeof UserSearchPaginated>;
interface UsersTableProps {
  data: ResponseType;
  paginationProps: PaginationRequest;
  onPaginationPropsChange: (args: PaginationRequest) => void;
  onRequestSort: (field: keyof AdminUserViewModelType) => void;
  sx?: SxProps<Theme>;
}

interface HeadCell<T> {
  field: keyof T;
  label: string;
  sortable: boolean;
  numeric: boolean;
}

const headCells: readonly HeadCell<AdminUserViewModelType>[] = [
  { field: 'id', label: 'Id', numeric: false, sortable: false },
  { field: 'avatarImageUrl', label: 'Zdjęcie', numeric: false, sortable: false },
  { field: 'name', label: 'Nazwa', numeric: false, sortable: true },
  { field: 'email', label: 'E-mail', numeric: false, sortable: true },
  { field: 'isCritic', label: 'Krytyk?', numeric: false, sortable: false },
];

function UsersTable({ data, paginationProps, onPaginationPropsChange, onRequestSort, sx }: UsersTableProps) {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdInDialog, setUserIdInDialog] = useState('');
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const handleChangePage = (_: React.MouseEvent | null, newPage: number) => {
    onPaginationPropsChange({ ...paginationProps, pageNumber: newPage });
  };
  const handleRowsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationPropsChange({ ...paginationProps, pageSize: parseInt(event.target.value, 10) });
  };

  const handleMakeUserCritic = async (id: string) => {
    await makeUserCritic(id);
    await queryClient.invalidateQueries(['users', pageNumber, pageSize, orderByField, orderDirection]);
    setUserIdInDialog('');
    setOpenDialog(false);
  };

  const handleOpenDialog = (userId: string) => {
    setUserIdInDialog(userId);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setUserIdInDialog('');
    setOpenDialog(false);
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
              <TableCell>Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  },
                }}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Avatar src={imgUrl(user.avatarImageUrl) ?? undefined} />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isCritic ? 'Tak' : 'Nie'}</TableCell>
                <TableCell>
                  {user.isCritic ? (
                    'Brak'
                  ) : (
                    <Button onClick={() => handleOpenDialog(user.id)}>Mianuj krytykiem</Button>
                  )}
                </TableCell>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Potwierdzenie rezerwacji'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Czy na pewno chcesz nadać temu użytkownikowi status krytyka?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Anuluj
          </Button>
          <Button onClick={() => handleMakeUserCritic(userIdInDialog)} color="primary" autoFocus>
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function AdminUsers() {
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 10 });
  const { pageNumber, pageSize, orderByField, orderDirection } = paginationProps;
  const [isInitLoading, setIsInitLoading] = useState(true);

  const { data, status, isLoading } = useQuery({
    queryKey: ['users', pageNumber, pageSize, orderByField, orderDirection],
    queryFn: () => getUsers(paginationProps),
    keepPreviousData: true,
    onSettled: () => {
      setIsInitLoading(false);
    },
  });
  const handleRequestSort = (property: keyof AdminUserViewModelType) => {
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
          <Typography variant="h4">Użytkownicy</Typography>
        </Grid>
      </Grid>
      {isInitLoading && isLoading && <LoadingTypography />}
      {status == 'success' && (
        <UsersTable
          data={data}
          paginationProps={paginationProps}
          onPaginationPropsChange={setPaginationProps}
          onRequestSort={handleRequestSort}
        />
      )}
    </Box>
  );
}

export default AdminUsers;
