import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { BookViewModelType } from '../../models/BookViewModel';
import { useNavigate } from 'react-router-dom';
import { imgUrl } from '../../utils/utils';

function AuthorBookCard({ book }: { book: BookViewModelType }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: 200, height: 400 }}>
      <CardMedia
        component="img"
        alt={book.title}
        height="280"
        image={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap textAlign={'center'}>
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
