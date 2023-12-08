import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useState } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

function AdminProfileHeaderIcon() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <Box onClick={() => toggle()}>
      <Tooltip title="Twoje konto">
        <PersonIcon sx={{ fontSize: '2rem', cursor: 'pointer' }} />
      </Tooltip>
      <Drawer anchor="right" open={open} onClose={() => toggle()}>
        <Box sx={{ width: '300px', p: 4 }} role="presentation">
          <Typography variant="h5" fontWeight={'bold'}>
            Twoje konto
          </Typography>
          <Typography variant="body1" component="div">
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to={`/admin/change-password`}>
                  <ListItemIcon>
                    <ChangeCircleIcon />
                  </ListItemIcon>
                  <ListItemText disableTypography>Zmiana hasła</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}

export default AdminProfileHeaderIcon;
