import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './shared/Header';
import Container from '@mui/material/Container';
import Footer from './shared/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import AdminBooks from './pages/admin/AdminBooks';
import AdminBookForm from './pages/admin/AdminBookForm';
import AdminHome from './pages/admin/AdminHome';
import AdminHeader from './shared/AdminHeader';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryForm from './pages/admin/AdminCategoryForm';
import AdminAuthors from './pages/admin/AdminAuthors';
import AdminAuthorForm from './pages/admin/AdminAuthorForm';
import AdminPublishers from './pages/admin/AdminPublishers';
import AdminPublisherForm from './pages/admin/AdminPublisherForm';
import AdminLibraries from './pages/admin/AdminLibraries';
import AdminLibraryForm from './pages/admin/AdminLibraryForm';
import { colors } from '@mui/material';

const mainTheme = createTheme({
  palette: {
    background: {
      default: '#FFFFFF',
    },
    primary: {
      main: orange[600],
    },
    secondary: {
      main: grey[800],
      dark: grey[500],
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
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
        <Route path="authors">
          <Route index element={<AdminAuthors />} />
          <Route path="add" element={<AdminAuthorForm />} />
        </Route>
        <Route path="books">
          <Route index element={<AdminBooks />} />
          <Route path="add" element={<AdminBookForm />} />
        </Route>
        <Route path="categories">
          <Route index element={<AdminCategories />} />
          <Route path="add" element={<AdminCategoryForm />} />
        </Route>
        <Route path="publishers">
          <Route index element={<AdminPublishers />} />
          <Route path="add" element={<AdminPublisherForm />} />
        </Route>
        <Route path="libraries">
          <Route index element={<AdminLibraries />} />
          <Route path='add' element={<AdminLibraryForm />} />
        </Route>
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
