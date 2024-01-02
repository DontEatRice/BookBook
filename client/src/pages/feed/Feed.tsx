import { useQuery } from '@tanstack/react-query';
import { getMyFeed } from '../../api/review';
import { useMemo, useState } from 'react';
import { PaginationRequest } from '../../utils/constants';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandableText from '../../components/common/ExpandableText';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { imgUrl } from '../../utils/utils';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import { BookCoverImg } from '../../components/common/Img';
import { ReviewWithBookViewModelType } from '../../models/reviews/ReviewWithBookViewModel';

const PAGE_SIZE = 15 as const;

function ReviewInFeed({ review }: { review: ReviewWithBookViewModelType }) {
  const theme = useTheme();
  const addedDate = useMemo(() => new Date(review.created), [review.created]);

  return (
    <Paper key={review.id} elevation={2} sx={{ padding: 2, mb: 2 }}>
      <Grid container>
        <Grid item xs={2} container sx={{ '&:hover': { textDecorationLine: 'underline' } }}>
          <Link to={`/books/${review.book.id}`}>
            <Box width={180} height={180}>
              <BookCoverImg
                alt="complex"
                loading="lazy"
                src={imgUrl(review.book.coverPictureUrl, '/podstawowa-ksiazka-otwarta.jpg')}
              />
            </Box>
            <Typography textAlign={'center'} variant="h6">
              {review.book.title}
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={10} container direction={'row'}>
          <Grid item xs={1} minHeight={56} minWidth={56}>
            <Link to={'/user/' + review.user.id}>
              <Avatar
                src={imgUrl(review.user.avatarImageUrl, '/autor-szablon.jpg')}
                sx={{ bgcolor: theme.palette.secondary.main, width: 56, height: 56 }}
              />
            </Link>
          </Grid>
          <Grid item xs={6} marginLeft={2}>
            <Typography variant="h5">{review.title}</Typography>
            <Link to={'/user/' + review.user.id}>
              <Typography
                sx={{ '&:hover': { textDecorationLine: 'underline' } }}
                marginBottom={2}
                display={'inline'}>
                {review.user.name}
              </Typography>
              <Typography display={'inline'}> {addedDate.toLocaleString()}</Typography>
            </Link>
          </Grid>
          <Grid item xs>
            <Box display="flex" justifyContent="flex-end">
              <Rating
                name="half-rating-read"
                value={review.rating == null ? 0 : review.rating}
                precision={1}
                readOnly
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography marginLeft={1}>
              <ExpandableText value={review.description ?? ''} maxChars={300} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function Feed() {
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<ReviewWithBookViewModelType[]>([]);
  const [paginationProps, setPaginationProps] = useState<PaginationRequest>({
    pageNumber: 0,
    pageSize: PAGE_SIZE,
  });

  const { isLoading } = useQuery({
    queryKey: ['feed', paginationProps],
    queryFn: () => getMyFeed(paginationProps),
    onSuccess: (response) => {
      if (response.count != totalCount) {
        setTotalCount(response.count);
      }
      setData(data.concat(response.data));
    },
    staleTime: undefined,
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ostatnia aktywność obserwowanych użytkowników
      </Typography>
      {data.map((review) => (
        <ReviewInFeed review={review} key={review.id} />
      ))}
      {data.length < totalCount && (
        <Box textAlign={'center'}>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={() =>
              setPaginationProps({ ...paginationProps, pageNumber: paginationProps.pageNumber + 1 })
            }>
            Więcej
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Feed;
