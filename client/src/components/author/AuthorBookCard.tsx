import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { BookViewModelType } from '../../models/BookViewModel';
import { useNavigate } from 'react-router-dom';

function AuthorBookCard({ book }: { book: BookViewModelType }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: 200, height: 400 }}>
      <CardMedia
        component="img"
        alt={book.title}
        height="280"
        image="https://image.ceneostatic.pl/data/products/85952195/i-wiedzmin-chrzest-ognia-tom-5-okladka-z-gry.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {book.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={() => navigate(`/books/${book.id}`)} fullWidth>
          Dowiedz się więcej
        </Button>
      </CardActions>
    </Card>
  );
}

export default AuthorBookCard;
