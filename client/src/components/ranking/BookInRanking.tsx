import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { BookInRankingViewModelType } from '../../models/BookInRankingViewModel';
import { imgUrl } from '../../utils/utils';
import { BookCoverImg } from '../common/Img';
import Box from '@mui/material/Box';
import { useState } from 'react';

export default function BookInRanking({
  book,
  position,
}: {
  book: BookInRankingViewModelType;
  position: number;
}) {
  const [elevation, setElevation] = useState(1);

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
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <Typography variant="h5" component="div" color="white">
                {position}
              </Typography>
            </Avatar>
          </Grid>
          <Grid item>
            <Box sx={{ width: 180, height: 180 }}>
              <BookCoverImg
                alt="complex"
                loading="lazy"
                src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
              />
            </Box>
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
              </Grid>
            </Grid>
            {book.averageRating && (
              <Grid item display={'flex'} flexDirection={'column'} minWidth={150} marginY={2}>
                <Rating name="half-rating-read" value={book.averageRating} precision={0.25} readOnly />
                <Typography variant="body1" gutterBottom marginTop={1}>
                  średnia: {book.averageRating}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {book.reviewsCount} {getRatingText(book.reviewsCount)}
                </Typography>
                {book.averageCriticRating && (
                  <Typography marginTop={1} variant="body1" gutterBottom>
                    średnia krytyków: {book.averageCriticRating}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Link>
    </Paper>
  );
}

function getRatingText(count: number) {
  if (count === 1) {
    return 'ocena';
  } else if (count > 1 && count < 5) {
    return 'oceny';
  } else {
    return 'ocen';
  }
}
