import { useNavigate } from 'react-router-dom';
import { AuthorViewModelType } from '../models/AuthorViewModel';
import { Avatar, Button, Grid, Paper, Typography } from '@mui/material';

function AuthorInList({ author }: { author: AuthorViewModelType }) {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Grid container spacing={2}>
        <Grid item>
          <Button sx={{ width: 128, height: 128 }} onClick={() => navigate(`/authors/${author.id}`)}>
            <Avatar
              alt={author.firstName + ' ' + author.lastName}
              src={
                author.profilePictureUrl == null
                  ? '../../../public/autor-szablon.jpg'
                  : author.profilePictureUrl
              }
              sx={{ width: 150, height: 150 }}
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {author.firstName + ' ' + author.lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {'Rok urodzenia: ' + author.birthYear}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AuthorInList;
