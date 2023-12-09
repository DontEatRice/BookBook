import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../../api/user';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import LoadingTypography from '../../components/common/LoadingTypography';
import { imgUrl } from '../../utils/utils';

function UserProfile() {
  const params = useParams();
  const { data, status } = useQuery({
    queryKey: ['users', params.userId],
    queryFn: () => getUserProfile(params.userId!),
  });

  return (
    <Box>
      {status == 'loading' && <LoadingTypography></LoadingTypography>}
      {status == 'success' && (
        <Card sx={{ display: 'flex' }}>
          <Avatar
            alt={data.userName}
            src={imgUrl(data.userImageUrl, '/public/autor-szablon.jpg')}
            sx={{ width: 200, height: 200, margin: 1 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                {data.userName}
              </Typography>
              {data.userLocation ?? (
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {data.userLocation}
                </Typography>
              )}
            </CardContent>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default UserProfile;
