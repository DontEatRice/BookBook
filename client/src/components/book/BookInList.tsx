import { BookViewModelType } from '../../models/BookViewModel';
import { Link } from 'react-router-dom';
import { imgUrl } from '../../utils/utils';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

function BookInList({ book }: { book: BookViewModelType }) {
  const [elevation, setElevation] = useState(3);

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  return (
    <Paper
      elevation={elevation}
      onMouseOver={() => setElevation(3)}
      onMouseOut={() => setElevation(1)}
      sx={{
        p: 2,
        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Link to={`/books/${book.id}`}>
        <Grid container spacing={2}>
          <Grid item>
            <Button sx={{ width: 180, height: 180 }}>
              <Img
                alt="complex"
                loading="lazy"
                src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h4" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {book.bookCategories.map((category) => category.name).join(', ')}
                </Typography>
                <Typography variant="body2" noWrap>
                  {book.description}
                </Typography>
              </Grid>
            </Grid>
            {book.averageRating && (
              <Grid item>
                <Rating value={book.averageRating} precision={0.25} readOnly />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Link>
    </Paper>
  );
}

export default BookInList;
