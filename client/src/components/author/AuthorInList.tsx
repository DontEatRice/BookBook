import { useNavigate } from 'react-router-dom';
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { Avatar, Button, Grid, Paper, Typography } from '@mui/material';
import { imgUrl } from '../../utils/utils';

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
      <Grid container spacing={5}>
        <Grid item>
          <Button sx={{ width: 200, height: 200 }} onClick={() => navigate(`/authors/${author.id}`)}>
            <Avatar
              alt={author.firstName + ' ' + author.lastName}
              src={imgUrl(author.profilePictureUrl, '/public/autor-szablon.jpg')}
              sx={{ width: 200, height: 200 }}
            />
          </Button>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                {author.firstName + ' ' + author.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
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
