import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

function Loading() {
  return (
    <Box
      position={'absolute'}
      left={0}
      top={0}
      width={'100%'}
      height={'100%'}
      sx={{ backgroundColor: 'white', zIndex: 999 }}>
      <Stack alignItems={'center'} justifyContent={'center'} height={'100%'}>
        <CircularProgress color={'secondary'} />
      </Stack>
    </Box>
  );
}

export default Loading;
