import { Link } from 'react-router-dom';
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { imgUrl } from '../../utils/utils';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AuthorInList({ author }: { author: AuthorViewModelType }) {
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
          <Box sx={{ width: 200, height: 200 }}>
            <Link to={`/authors/${author.id}`}>
              <Avatar
                alt={author.firstName + ' ' + author.lastName}
                src={imgUrl(author.profilePictureUrl, '/public/autor-szablon.jpg')}
                sx={{ width: 200, height: 200 }}
                imgProps={{
                  loading: 'lazy',
                }}
              />
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h4" component="div">
                <Link to={`/authors/${author.id}`}>{author.firstName + ' ' + author.lastName}</Link>
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
