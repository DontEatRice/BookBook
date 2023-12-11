import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../api/user';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Grid, Typography, Paper, Tabs, Tab } from '@mui/material';
import { imgUrl } from '../../utils/utils';
import LoadingTypography from '../../components/common/LoadingTypography';
import PlaceIcon from '@mui/icons-material/Place';
import { SyntheticEvent, useState } from 'react';
import AuthorBookCard from '../../components/author/AuthorBookCard';

function UserProfile() {
  const params = useParams();
  const { data, status } = useQuery({
    queryKey: ['users', params.userId],
    queryFn: () => getUserProfile(params.userId!),
  });
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e: SyntheticEvent, tabIndex: number) => {
    setCurrentTabIndex(tabIndex);
  };
  return (
    <Box>
      {status == 'loading' && <LoadingTypography></LoadingTypography>}
      {status == 'success' && (
        <>
          <Paper
            sx={{
              p: 2,
              // marginTop: 2,
              flexGrow: 1,
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
            }}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar
                  alt={data.userName}
                  src={imgUrl(data.userImageUrl, '/public/autor-szablon.jpg')}
                  sx={{ width: 200, height: 200, margin: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant="h4" component="div">
                      {data.userName}
                    </Typography>
                    {data.userLocation ?? (
                      <Box>
                        <PlaceIcon></PlaceIcon>
                        <Typography variant="body1" gutterBottom>
                          {data.userLocation}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Tabs value={currentTabIndex} onChange={handleTabChange} centered>
              <Tab label="O mnie" />
              <Tab label="Ostatnio przeczytane" />
              <Tab label="Recenzje" />
            </Tabs>
            {currentTabIndex === 0 && (
              <Box sx={{ p: 3 }}>
                <>
                  {data.aboutMe != null && data.aboutMe != '' && (
                    <div>
                      <Typography variant="h5" gutterBottom>
                        Kilka słów o mnie
                      </Typography>
                      <Typography>{data.aboutMe}</Typography>
                    </div>
                  )}
                  {data.aboutMe == null ||
                    (data.aboutMe === '' && (
                      <Typography variant="h5">{data.userName} nie dodał swojego opisu</Typography>
                    ))}
                </>
              </Box>
            )}

            {currentTabIndex === 1 && (
              <Box sx={{ p: 3 }} alignItems={'center'} justifyContent={'center'} display={'flex'}>
                <Box display={'flex'} flexDirection={'row'}>
                  {data.userLastReadBooks.length == 0 && (
                    <Typography variant="h5">
                      Wygląda na to, że {data.userName} jeszcze nic u nas nie zarezerwował
                    </Typography>
                  )}
                  {data.userLastReadBooks.length > 0 && (
                    <Grid container flexDirection={'row'} spacing={3}>
                      {data.userLastReadBooks.map((book) => (
                        <Grid item xs key={book.id}>
                          <AuthorBookCard book={book} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Box>
            )}

            {currentTabIndex === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5">Tab 3 Content</Typography>
                <Typography>
                  It is a long established fact that a reader will be distracted by the readable content of a
                  page when looking at its layout. The point of using Lorem Ipsum is that it has a
                  more-or-less normal distribution of letters, as opposed to using 'Content here, content
                  here', making it look like readable English.
                </Typography>
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export default UserProfile;
