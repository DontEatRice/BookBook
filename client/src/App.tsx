import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './shared/Header';
import Container from '@mui/material/Container';
import Footer from './shared/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
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
import AdminBooksInLibrary from './pages/admin/AdminBooksInLibrary';
import AdminAddBookToLibraryForm from './pages/admin/AdminAddBookToLibraryForm';
import BookDetails from './pages/book/BookDetails';
import Reservations from './components/reservations/Books';

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
        <Route path="books">
          <Route index element={<BookDetails />} />
          <Route path=":bookId" element={<BookDetails />} />
        </Route>
      </Route>
      <Route path="/reservations" element={<Layout />}>
        <Route index element={<Reservations />} />
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
          <Route path="add" element={<AdminLibraryForm />} />
        </Route>
        <Route path="booksInLibrary">
          <Route index element={<AdminBooksInLibrary />} />
          <Route path="add" element={<AdminAddBookToLibraryForm />} />
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

