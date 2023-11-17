import { TableHead, TableBody, Table, Grid, TableRow, TableContainer } from '@mui/material';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import { useTheme } from '@mui/material/styles';
import { BookViewModelType } from '../../models/BookViewModel';
import AddReviewForm from '../../pages/review/AddReviewForm'
import ReviewTableRow from '../../pages/review/ReviewTableRow'
import { ReviewViewModelType } from '../../models/ReviewViewModel';

function Reviews({ book, reviews }: { book: BookViewModelType, reviews: ReviewViewModelType[] }) {
    const theme = useTheme();
  
    return (
      <TableContainer sx={{ display: 'flex', backgroundColor: theme.palette.background.default }}>
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
        {reviews.filter(x => x.description != "" && x.title != "").map((review) => (
            <ReviewTableRow review={review} book={book} key={review.id}></ReviewTableRow>
          ))}
        </TableBody>
      </Table>
      <Grid item><AddReviewForm book={book}/></Grid>
    </TableContainer>
    );
}

export default Reviews;