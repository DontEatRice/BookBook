import { TableHead, TableBody, Table, TableRow, TableContainer } from '@mui/material';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import { useTheme } from '@mui/material/styles';
import { BookViewModelType } from '../../models/BookViewModel';
import ReviewTableRow from './ReviewTableRow';
import { ReviewViewModelType } from '../../models/ReviewViewModel';

function Reviews({ book, reviews }: { book: BookViewModelType; reviews: ReviewViewModelType[] }) {
  const theme = useTheme();

  return (
    <TableContainer
      sx={{ display: 'flex', backgroundColor: theme.palette.background.default, marginBottom: 2 }}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Użytkownik</StyledTableCell>
            <StyledTableCell>Ocena</StyledTableCell>
            <StyledTableCell>Komentarz</StyledTableCell>
            <StyledTableCell>Akcje</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews
            .filter((x) => x.title != '')
            .map((review) => (
              <ReviewTableRow review={review} book={book} key={review.id}></ReviewTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Reviews;
