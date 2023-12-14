import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getUserReviews, ReviewInUserProfilePaginated } from '../../api/user';
import { Link, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  styled,
  Rating,
  SxProps,
  Theme,
  Pagination,
} from '@mui/material';
import { imgUrl } from '../../utils/utils';
import LoadingTypography from '../../components/common/LoadingTypography';
import PlaceIcon from '@mui/icons-material/Place';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import AuthorBookCard from '../../components/author/AuthorBookCard';
import Loading from '../../components/common/Loading';
import { PaginationRequest } from '../../utils/constants';
import { z } from 'zod';

function UserProfile() {
  const params = useParams();
  const { data, status } = useQuery({
    queryKey: ['users', params.userId],
    queryFn: () => getUserProfile(params.userId!),
  });

  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({ pageNumber: 0, pageSize: 5 });
  const { pageNumber } = paginationProps;

  const { data: userReviews, status: userReviewsStatus } = useQuery({
    queryKey: ['userReviews', params.userId, pageNumber],
    queryFn: () =>
      getUserReviews({
        ...paginationProps,
        userId: params.userId!,
      }),
    keepPreviousData: true,
  });

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (_e: SyntheticEvent, tabIndex: number) => {
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
                    <Typography variant="h6" gutterBottom>
                      <PlaceIcon></PlaceIcon>
                      {data.userLocation == null ? 'Brak adresu' : data.userLocation}
                    </Typography>
                    <Typography variant="body1">Przeczytane książki: {data.readBooksCount}</Typography>
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
                      <Typography variant="h5" textAlign={'center'}>
                        {data.userName} nie dodał swojego opisu
                      </Typography>
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

            {currentTabIndex === 2 && userReviewsStatus == 'success' && (
              <UserProfileReviews
                data={userReviews}
                onPaginationPropsChange={setPaginationProps}
                paginationProps={paginationProps}
              />
            )}
            {currentTabIndex === 2 && userReviewsStatus == 'loading' && <Loading></Loading>}
          </Paper>
        </>
      )}
    </Box>
  );
}

type PaginatedReviewsResponse = z.infer<typeof ReviewInUserProfilePaginated>;
interface UserProfileReviewsProps {
  data: PaginatedReviewsResponse;
  paginationProps: PaginationRequest;
  onPaginationPropsChange: (args: PaginationRequest) => void;
  sx?: SxProps<Theme>;
}
function UserProfileReviews({ data, paginationProps, onPaginationPropsChange, sx }: UserProfileReviewsProps) {
  const { pageNumber } = paginationProps;
  const handleChangePage = (_: ChangeEvent<unknown>, newPage: number) => {
    onPaginationPropsChange({ ...paginationProps, pageNumber: newPage - 1 });
  };
  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    height: 160,
    width: 128,
  });
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" textAlign={'center'} marginBottom={6}>
        Opinie użytkownika
      </Typography>
      <Grid container spacing={5} marginBottom={3}>
        {data.data.map((review) => (
          <Grid item xs={12} key={review.bookId}>
            <Box sx={{ width: '100%', boxShadow: 1 }}>
              <Grid container direction={'row'} spacing={3}>
                <Grid item xs={3}>
                  <Link to={`/books/${review.bookId}`}>
                    <Img
                      alt="complex"
                      loading="lazy"
                      src={imgUrl(review.bookCoverUrl, '/podstawowa-ksiazka-otwarta.jpg')}
                    />
                    <Typography textAlign={'center'} variant="h6">
                      {review.bookTitle}
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="h5" gutterBottom>
                    {review.title ?? 'Brak tytułu'}
                  </Typography>
                  <Typography variant="subtitle1">{review.description ?? 'Brak'}</Typography>
                </Grid>
                <Grid item xs={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <Typography variant="h4">
                    {review.rating}
                    <Rating max={1} value={review.rating / 5} precision={0.1} size="large" readOnly></Rating>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Pagination
          onChange={handleChangePage}
          page={pageNumber + 1}
          count={Math.ceil(data.count / 5)}
          sx={{ justifySelf: 'center' }}
          size="large"
        />
      </Box>
    </Box>
  );
}

export default UserProfile;
