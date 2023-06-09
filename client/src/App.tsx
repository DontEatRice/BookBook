import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './shared/Header';
import Container from '@mui/material/Container';
import Footer from './shared/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import AdminBooks from './pages/admin/AdminBooks';
import AdminHome from './pages/admin/AdminHome';
import AdminHeader from './shared/AdminHeader';

const mainTheme = createTheme({
  palette: {
    background: {
      default: orange[100],
    },
    primary: {
      main: orange[800],
    },
    secondary: {
      main: orange[200],
      dark: orange[300],
    },
  },
});

const adminTheme = createTheme({});

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<div>NotFound</div>} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="*" element={<div>NotFound</div>} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

function AdminLayout() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <AdminHeader />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
