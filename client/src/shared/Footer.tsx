import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: theme.palette.secondary.main }} mt={3}>
      2023 Copyright BookBook All Rigths Reserved
    </Box>
  );
}

export default Footer;
