import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { MostReservedBookViewModelType } from '../../models/MostReseredBook';
import { styled } from '@mui/material/styles';
import { imgUrl } from '../../utils/utils';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function BookTile({ book }: { book: MostReservedBookViewModelType }) {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Paper elevation={1} sx={{ width: '300px', backgroundColor: theme.palette.secondary.main, p: 1 }}>
      <Box py={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{book.title}</Typography>
        <Button sx={{ height: 250, my: 2 }} onClick={() => navigate(`/books/${book.id}`)}>
          <Img
            alt="complex"
            loading="lazy"
            src={imgUrl(book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
          />
        </Button>
        <Button variant="contained" onClick={() => navigate(`/books/${book.id}`)}>
          Kliknij aby dowiedziec się wiecej
        </Button>
      </Box>
    </Paper>
  );
}

export default BookTile;

