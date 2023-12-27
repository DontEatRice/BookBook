import { Link } from 'react-router-dom';
import { AuthorViewModelType } from '../../models/author/AuthorViewModel';
import { imgUrl } from '../../utils/utils';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ExpandableText from '../common/ExpandableText';

function AuthorInList({ author }: { author: AuthorViewModelType }) {
  const [elevation, setElevation] = useState(3);

  return (
    <Paper
      elevation={elevation}
      onMouseOver={() => setElevation(3)}
      onMouseOut={() => setElevation(1)}
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
      }}>
      <Link to={`/authors/${author.id}`}>
        <Grid container spacing={5}>
          <Grid item>
            <Box>
              <Avatar
                alt={author.firstName + ' ' + author.lastName}
                src={imgUrl(author.profilePictureUrl, '/public/autor-szablon.jpg')}
                sx={{ width: 150, height: 150 }}
                imgProps={{
                  loading: 'lazy',
                }}
              />
            </Box>
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
                <Typography variant="body2">
                  <ExpandableText value={author.description ?? ''} maxChars={300} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Link>
    </Paper>
  );
}

export default AuthorInList;
