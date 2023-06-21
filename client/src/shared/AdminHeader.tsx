import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function AdminHeader() {
  const theme = useTheme();
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        fontSize: '1.5rem',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.grey[100],
        padding: theme.spacing(2),
      }}>
      <Link to="/admin" style={{ textDecoration: 'none' }}>
        <Typography
          sx={{ display: 'inline', backgroundColor: theme.palette.primary.light, p: 1 }}
          variant="h5">
          BookBook Admin
        </Typography>
      </Link>
      <NavItem label="Książki" link="/admin/books" />
    </header>
  );
}

function NavItem({ label, link }: { label: string; link: string }) {
  const [hover, setHover] = useState(false);
  const theme = useTheme();
  if (!link.startsWith('/admin')) {
    link = link.startsWith('/') ? '/admin' + link : '/admin/' + link;
  }
  return (
    <NavLink
      to={link}
      style={({ isActive }) => {
        return {
          textDecoration: 'none',
          display: 'inline',
          marginLeft: theme.spacing(3),
          padding: theme.spacing(1),
          backgroundColor: theme.palette.grey[400],
          border: isActive || hover ? '2px solid black' : '2px solid transparent',
        };
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div style={{ display: 'inline-block', fontFamily: theme.typography.fontFamily }}>{label}</div>
    </NavLink>
  );
}

export default AdminHeader;
