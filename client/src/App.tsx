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
import AdminAuthorUpdateForm from './pages/admin/AdminAuthorUpdateForm';
import AdminPublishers from './pages/admin/AdminPublishers';
import AdminPublisherForm from './pages/admin/AdminPublisherForm';
import AdminPublisherUpdateForm from './pages/admin/AdminPublisherUpdateForm';
import AdminLibraries from './pages/admin/AdminLibraries';
import AdminLibraryForm from './pages/admin/AdminLibraryForm';
import AdminLibraryUpdateForm from './pages/admin/AdminLibraryUpdateForm';
import AdminBooksInLibrary from './pages/admin/AdminBooksInLibrary';
import AdminAddBookToLibraryForm from './pages/admin/AdminAddBookToLibraryForm';
import Login from './pages/auth/Login';
import Box from '@mui/material/Box';
import BooksList from './pages/book/BooksList';
import BookDetails from './pages/book/BookDetails';
import Register from './pages/auth/Register';
import ChangePassword from './pages/account/ChangePassword';
import AdminReservationList from './pages/admin/AdminReservations';
import UserBooksList from './pages/user/UserBooks';
import AuthorsList from './pages/author/AuthorsList';
import AuthorDetails from './pages/author/AuthorDetails';
import LibraryDetails from './pages/library/LibraryDetails';
import AdminRegisterEmployeeForm from './pages/admin/AdminRegisterEmployeeForm';
import BookRanking from './pages/book/BookRanking';
import ReservationList from './pages/reservations/ReservationList';
import AdminBookUpdateForm from './pages/admin/AdminBookUpdateForm';
import Settings from './pages/account/AccountSettings';
import UserProfile from './pages/user/UserProfile';

const mainTheme = createTheme({
  palette: {
    background: {
      default: grey[50],
    },
    primary: {
      light: orange[200],
      main: orange[600],
    },
    secondary: {
      main: grey[200],
      dark: grey[900],
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
  },
});

const adminTheme = createTheme({});

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="account">
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="user">
          <Route path=":userId" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<div>NotFound</div>} />
        <Route path="books" element={<BooksList />} />
        <Route path="reservations" element={<ReservationList />} />
        <Route path="books">
          <Route index element={<BooksList />} />
          <Route path=":bookId" element={<BookDetails />} />
        </Route>
        <Route path="user-books" element={<UserBooksList />} />
        <Route path="authors">
          <Route index element={<AuthorsList />} />
          <Route path=":authorId" element={<AuthorDetails />} />
        </Route>
        <Route path="ranking">
          <Route index element={<BookRanking />} />
        </Route>
        <Route path="libraries">
          <Route index element />
          <Route path=":libraryId" element={<LibraryDetails />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="authors">
          <Route index element={<AdminAuthors />} />
          <Route path="add" element={<AdminAuthorForm />} />
          <Route path=":authorId" element={<AdminAuthorUpdateForm />} />
        </Route>
        <Route path="books">
          <Route index element={<AdminBooks />} />
          <Route path="add" element={<AdminBookForm />} />
          <Route path=":bookId" element={<AdminBookUpdateForm />} />
        </Route>
        <Route path="categories">
          <Route index element={<AdminCategories />} />
          <Route path="add" element={<AdminCategoryForm />} />
          <Route path=":bookId" element={<AdminAuthorUpdateForm />} />
        </Route>
        <Route path="publishers">
          <Route index element={<AdminPublishers />} />
          <Route path="add" element={<AdminPublisherForm />} />
          <Route path=":publisherId" element={<AdminPublisherUpdateForm />} />
        </Route>
        <Route path="libraries">
          <Route index element={<AdminLibraries />} />
          <Route path="add" element={<AdminLibraryForm />} />
          <Route path=":libraryId" element={<AdminLibraryUpdateForm />} />
        </Route>
        <Route path="booksInLibrary">
          <Route index element={<AdminBooksInLibrary />} />
          <Route path="add" element={<AdminAddBookToLibraryForm />} />
        </Route>
        <Route path="reservations">
          <Route index element={<AdminReservationList />} />
        </Route>
        <Route path="add-employee">
          <Route index element={<AdminRegisterEmployeeForm />} />
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
      <Box sx={{ minHeight: '100vh' }}>
        <Header />
        <Container>
          <Outlet />
        </Container>
      </Box>
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
