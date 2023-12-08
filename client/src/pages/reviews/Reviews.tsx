import { TableHead, TableBody, Table, TableRow, TableContainer, Stack } from '@mui/material';
import StyledTableCell from '../../components/tableComponents/StyledTableCell';
import { useTheme } from '@mui/material/styles';
import { BookViewModelType } from '../../models/BookViewModel';
import ReviewTableRow from './ReviewTableRow';
import { ReviewViewModelType } from '../../models/ReviewViewModel';
import AddReviewForm from './AddReviewForm';

function Reviews({ book, reviews }: { book: BookViewModelType; reviews: ReviewViewModelType[] }) {
  const theme = useTheme();

  return (
    <Stack
      sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.background.default }}>
          <AddReviewForm book={book}></AddReviewForm>
          {reviews
            .map((review) => (
              <ReviewTableRow review={review} book={book} key={review.id}></ReviewTableRow>
            ))}
    </Stack>
  );
}

export default Reviews;
