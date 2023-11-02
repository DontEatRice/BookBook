import { Button, Card, CardActions, CardContent, CardMedia, Typography, useTheme } from '@mui/material';
import { BookViewModelType } from '../../models/BookViewModel';
import { useNavigate } from 'react-router-dom';

function AuthorBookCard({ book }: { book: BookViewModelType }) {
  const theme = useTheme();
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
        <div>
          <Button size="small" variant="contained" onClick={() => navigate(`/books/${book.id}`)}>
            Dowiedz się więcej
          </Button>
        </div>
      </CardActions>
    </Card>
  );
}

export default AuthorBookCard;
