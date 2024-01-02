import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  followUser,
  getUserFollows,
  getUserProfile,
  getUserReviews,
  ReviewInUserProfilePaginated,
  unfollowUser,
  UserInfoPaginated,
} from '../../api/user';
import { Link, useParams } from 'react-router-dom';
import { imgUrl } from '../../utils/utils';
import LoadingTypography from '../../components/common/LoadingTypography';
import PlaceIcon from '@mui/icons-material/Place';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import AuthorBookCard from '../../components/author/AuthorBookCard';
import { PaginationRequest } from '../../utils/constants';
import { z } from 'zod';
import StarsIcon from '@mui/icons-material/Stars';
import { ReviewInUserProfileViewModelType } from '../../models/user/ReviewInUserProfileViewModel';
import ExpandableText from '../../components/common/ExpandableText';
import AuthorizedView from '../../components/auth/AuthorizedView';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '../../utils/auth/useAuth';
import { UserInfoViewModelType } from '../../models/user/UserInfoViewModel';
import { Stack } from '@mui/material';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  height: 160,
  width: 128,
});

function UserProfile() {
  const params = useParams();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ['users', params.userId],
    queryFn: () => getUserProfile(params.userId!),
  });
  const { user } = useAuth();

  const [reviewsPagingProps, setReviewsPagingProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 5,
  });
  const [followsPagingProps, setFollowsPagingProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
  });
  const { pageNumber } = reviewsPagingProps;

  const { data: userReviews, status: userReviewsStatus } = useQuery({
    queryKey: ['userReviews', params.userId, pageNumber],
    queryFn: () =>
      getUserReviews({
        ...reviewsPagingProps,
        userId: params.userId!,
      }),
    keepPreviousData: true,
  });

  const { data: follows, status: followsStatus } = useQuery({
    queryKey: ['userFollows', params.userId, followsPagingProps.pageNumber],
    queryFn: () => getUserFollows({ ...followsPagingProps, userId: params.userId! }),
    keepPreviousData: true,
  });

  const { mutate: followUserMutate, isLoading: followUserIsLoading } = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.setQueryData(['users', params.userId], {
        ...data,
        followedByMe: true,
        followersCount: (data?.followersCount ?? 0) + 1,
      });
    },
  });

  const { mutate: unfollowUserMutate, isLoading: unfollowUserIsLoading } = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.setQueryData(['users', params.userId], {
        ...data,
        followedByMe: false,
        followersCount: (data?.followersCount ?? 1) - 1,
      });
    },
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
                  src={imgUrl(data.userImageUrl, '/autor-szablon.jpg')}
                  sx={{ width: 200, height: 200, margin: 1 }}
                />
              </Grid>
              <Grid item xs sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Grid
                      item
                      xs
                      container
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}>
                      <Typography variant="h4" component="div" gutterBottom={!data.isCritic}>
                        {data.userName}
                      </Typography>
                      {user?.id !== params.userId && (
                        <AuthorizedView roles={['User']}>
                          {data.followedByMe ? (
                            <Button
                              onClick={() => unfollowUserMutate(params.userId!)}
                              disabled={unfollowUserIsLoading}>
                              Obserwowany
                            </Button>
                          ) : (
                            <Button
                              variant={'contained'}
                              onClick={() => followUserMutate(params.userId!)}
                              disabled={followUserIsLoading}>
                              Obserwuj
                            </Button>
                          )}
                        </AuthorizedView>
                      )}
                      {user?.id === params.userId && (
                        <Button variant="contained" component={Link} to="/account/settings">
                          Edytuj
                        </Button>
                      )}
                    </Grid>
                    {data.isCritic && (
                      <Typography variant="h5" color={'primary'} gutterBottom>
                        <Stack direction={'row'} alignItems={'center'}>
                          <span>Krytyk</span>
                          <StarsIcon />
                        </Stack>
                      </Typography>
                    )}
                    <Typography variant="h6" gutterBottom>
                      <PlaceIcon />
                      {data.userLocation == null ? 'Brak adresu' : data.userLocation}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Użytkownik od: {getUserFrom(data.registeredAt)}
                    </Typography>
                    <Typography variant="body1">
                      Przeczytane książki <b>{data.readBooksCount}</b>
                    </Typography>
                    <Typography variant="body1">
                      Obserwujących <b>{data.followersCount.toLocaleString()}</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Tabs value={currentTabIndex} onChange={handleTabChange} centered>
              <Tab label="O mnie" />
              <Tab label="Ostatnio przeczytane" />
              <Tab label="Recenzje" />
              <Tab label="Obserwowani" />
            </Tabs>
            {currentTabIndex === 0 && (
              <Box sx={{ p: 3 }}>
                {!data.aboutMe || data.aboutMe === '' ? (
                  <Typography variant="h5" textAlign={'center'}>
                    {data.userName} nie dodał swojego opisu
                  </Typography>
                ) : (
                  <div>
                    <Typography variant="h5" gutterBottom>
                      Kilka słów o mnie
                    </Typography>
                    <Typography variant="h6">
                      <ExpandableText value={data.aboutMe} maxChars={200} />
                    </Typography>
                  </div>
                )}
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
                onPaginationPropsChange={setReviewsPagingProps}
                paginationProps={reviewsPagingProps}
              />
            )}
            {currentTabIndex === 2 && userReviewsStatus == 'loading' && <LoadingTypography />}
            {currentTabIndex === 3 && followsStatus == 'success' && (
              <UserFollows
                data={follows}
                paginationProps={followsPagingProps}
                onPaginationPropsChange={setFollowsPagingProps}
              />
            )}
            {currentTabIndex === 3 && followsStatus == 'loading' && <LoadingTypography />}
          </Paper>
        </>
      )}
    </Box>
  );
}

function ReviewItem({ review }: { review: ReviewInUserProfileViewModelType }) {
  const [elevation, setElevation] = useState(1);

  return (
    <Paper
      onMouseOver={() => setElevation(3)}
      onMouseOut={() => setElevation(1)}
      sx={{ width: '100%', p: 2 }}
      elevation={elevation}>
      <Grid container direction={'row'} spacing={2}>
        <Grid item xs={3} sx={{ '&:hover': { textDecorationLine: 'underline' } }}>
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
    </Paper>
  );
}

function FollowedUser({ user }: { user: UserInfoViewModelType }) {
  const [elevation, setElevation] = useState(1);
  const theme = useTheme();

  return (
    <Paper
      elevation={elevation}
      onMouseOver={() => setElevation(3)}
      onMouseOut={() => setElevation(1)}
      sx={{ padding: 2, width: '75%', mb: 2, ml: 'auto', mr: 'auto' }}>
      <Link to={`/user/${user.id}`}>
        <Grid container direction={'row'} wrap="nowrap">
          <Grid item xs={1} minHeight={56} minWidth={56}>
            <Avatar
              src={imgUrl(user.userImageUrl, '/autor-szablon.jpg')}
              sx={{ bgcolor: theme.palette.secondary.main, width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs marginLeft={2}>
            <Typography variant="h5">{user.userName}</Typography>
            {user.isCritic && (
              <Typography color={'primary'} gutterBottom>
                <Stack direction={'row'} alignItems={'center'}>
                  <span>Krytyk</span>
                  <StarsIcon />
                </Stack>
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography marginLeft={1}>
            <ExpandableText value={user.aboutMe ?? ''} maxChars={400} />
          </Typography>
        </Grid>
      </Link>
    </Paper>
  );
}

type PaginatedReviewsResponse = z.infer<typeof ReviewInUserProfilePaginated>;
interface UserProfileReviewsProps {
  data: PaginatedReviewsResponse;
  paginationProps: PaginationRequest;
  onPaginationPropsChange: (args: PaginationRequest) => void;
}
function UserProfileReviews({ data, paginationProps, onPaginationPropsChange }: UserProfileReviewsProps) {
  const { pageNumber } = paginationProps;
  const handleChangePage = (_: ChangeEvent<unknown>, newPage: number) => {
    onPaginationPropsChange({ ...paginationProps, pageNumber: newPage - 1 });
  };

  return (
    <Box sx={{ p: 3 }}>
      {data.data.length > 0 ? (
        <Typography variant="h5" textAlign={'center'} marginBottom={6}>
          Opinie użytkownika
        </Typography>
      ) : (
        <Typography variant="h5" textAlign={'center'}>
          Użytkownik nie dodał żadnej opinii
        </Typography>
      )}
      <Grid container spacing={3} marginBottom={3}>
        {data.data.map((review) => (
          <Grid item xs={12} key={review.bookId}>
            <ReviewItem review={review} />
          </Grid>
        ))}
      </Grid>
      {data.data.length > 0 && (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Pagination
            onChange={handleChangePage}
            page={pageNumber + 1}
            count={Math.ceil(data.count / 5)}
            sx={{ justifySelf: 'center' }}
            size="large"
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

type PaginatedFollowsResponse = z.infer<typeof UserInfoPaginated>;
interface UserFollowsProps {
  data: PaginatedFollowsResponse;
  paginationProps: PaginationRequest;
  onPaginationPropsChange: (args: PaginationRequest) => void;
}
function UserFollows({ data, onPaginationPropsChange, paginationProps }: UserFollowsProps) {
  const { pageNumber } = paginationProps;

  return (
    <Box sx={{ p: 3 }}>
      {data.data.length == 0 && (
        <Typography variant="h5" textAlign={'center'}>
          Użytkownik jeszcze nikogo nie obserwuje
        </Typography>
      )}
      <Grid container spacing={3} marginBottom={3}>
        {data.data.map((user) => (
          <Grid item xs={12} key={user.id}>
            <FollowedUser user={user} />
          </Grid>
        ))}
      </Grid>
      {data.data.length > 0 && (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Pagination
            onChange={(_, page) => onPaginationPropsChange({ ...paginationProps, pageNumber: page - 1 })}
            page={pageNumber + 1}
            count={Math.ceil(data.count / 5)}
            sx={{ justifySelf: 'center' }}
            size="large"
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

function getUserFrom(registeredAt: string) {
  const date = new Date(registeredAt);
  return (
    date.toLocaleString('pl-PL', {
      month: 'long',
    }) +
    ' ' +
    date.getFullYear()
  );
}

export default UserProfile;
