import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './shared/Header';
import Container from '@mui/material/Container';
import Footer from './shared/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import AdminHome from './pages/Admin/AdminHome';
import CssBaseline from '@mui/material/CssBaseline';

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<div>NotFound</div>} />
      </Route>
      <Route path="/admin">
        <Route index element={<AdminHome />} />
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

export default App;
