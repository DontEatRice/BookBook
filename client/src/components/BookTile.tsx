import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BookType } from '../models';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function BookTile({ book }: { book: BookType }) {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Paper elevation={1} sx={{ width: '300px', backgroundColor: theme.palette.secondary.main, p: 1 }}>
      <Box p={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{book.name}</Typography>
        <Box
          ml="auto"
          mr="auto"
          mt={1}
          mb={1}
          sx={{ width: '250px', height: '400px', backgroundColor: 'gray' }}>
          Obrazek tutaj
        </Box>
        <Button variant="contained" onClick={() => navigate(`/book/${book.id}`)}>
          Kliknij aby dowiedziec się wiecej
        </Button>
      </Box>
    </Paper>
  );
}

export default BookTile;
