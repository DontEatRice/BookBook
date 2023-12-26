import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { BookInRankingViewModelType } from '../../models/BookInRankingViewModel';
import { imgUrl } from '../../utils/utils';

export default function BookInRanking({
  book,
  position,
}: {
  book: BookInRankingViewModelType;
  position: number;
}) {
  const navigate = useNavigate();

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });
  return (
    <Paper
      sx={{
        p: 2,

        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <Typography variant="h5" component="div" color="white">
              {position}
            </Typography>
          </Avatar>
        </Grid>
        <Grid item>
          <Button sx={{ width: 180, height: 180 }} onClick={() => navigate(`/books/${book.id}`)}>
            <Img
              alt="complex"
              loading="lazy"
              src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
            />
          </Button>
        </Grid>
        <Grid item xs={10} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {book.authors.map((author) => author.firstName + ' ' + author.lastName).join(', ')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {book.bookCategories.map((category) => category.name).join(', ')}
              </Typography>
            </Grid>
          </Grid>
          <Grid item display={'flex'} flexDirection={'column'} minWidth={150} marginY={2}>
            <Typography variant="subtitle1" marginTop={1}>
              Użytkownicy:
            </Typography>
            <Typography variant="h6" marginTop={1}>
              średnia:{' '}
              {book.averageRating == null
                ? 'brak ocen'
                : book.averageRating + ' z ' + book.reviewsCount + ' ' + getRatingText(book.reviewsCount)}
            </Typography>
            <Typography variant="subtitle1" marginTop={1}>
              Krytycy:
            </Typography>
            <Typography marginTop={1} variant="h6">
              średnia:{' '}
              {book.averageCriticRating == null
                ? 'brak ocen'
                : book.averageCriticRating +
                  ' z ' +
                  book.criticReviewsCount +
                  ' ' +
                  getRatingText(book.criticReviewsCount)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function getRatingText(count: number) {
  if (count === 1) {
    return 'oceny';
  } else {
    return 'ocen';
  }
}
