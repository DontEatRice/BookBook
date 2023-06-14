import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { useState, MouseEvent } from 'react';
import { BookType } from '../../models/Book';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof BookType;
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
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Tytuł',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: true,
    label: 'Cena',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof BookType) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableProps) {
  const createSortHandler = (property: keyof BookType) => (event: MouseEvent<unknown>) => {
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

function Books() {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof BookType>('id');
  return (
    <Box mt={1}>
      Books
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            onRequestSort={(e, prop) => console.log({ e, prop })}
            orderBy={orderBy}
          />
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Books;
