import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { addToCart } from '../../api/cart';
import useAlert from '../../utils/alerts/useAlert';
import { useCartStore } from '../../store';
import AuthorizedView from '../auth/AuthorizedView';
import { Link } from 'react-router-dom';

function LibrariesStack({ libraries, bookId }: { libraries: LibraryViewModelType[]; bookId: string }) {
  const { showError, showSuccess } = useAlert();
  const cartStore = useCartStore();
  const handleAddToCart = async (bookId: string, libraryId: string) => {
    try {
      await addToCart({ bookId, libraryId });
      showSuccess({ message: 'Dodano do koszyka!' });
      cartStore.toggleIsChanged();
    } catch (error) {
      const err = error as Error;
      switch (err.message) {
        case 'BOOK_ALREADY_IN_CART':
          showError({ message: 'Książka została już dodana do koszyka' });
          break;
        case 'BOOK_NOT_FOUND':
          showError({ message: 'Książka nie została znaleziona' });
          break;
        case 'LIBRARY_NOT_FOUND':
          showError({ message: 'Biblioteka nie została znaleziona' });
          break;
        default:
          showError({ message: `Wystąpił nieznany błąd: ${err.message}` });
          break;
      }
    }
  };
  if (libraries.length > 0) {
    return (
      <Stack direction={'column'} spacing={1} style={{ overflow: 'auto', height: 500 }}>
        {libraries.map((library) => (
          <Paper
            key={library.id}
            elevation={2}
            sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Link to={`/libraries/${library.id}`}>
                <Typography variant="h6">{library.name}</Typography>
              </Link>
              <Typography>
                {library.address.street + ' ' + library.address.number}
                {library.address.apartment == null ? '' : '/'}
                {library.address.apartment ?? ''}
              </Typography>
              <Typography>{library.address.postalCode + ' ' + library.address.city}</Typography>
            </div>
            <AuthorizedView>
              <Button onClick={() => handleAddToCart(bookId, library.id)}>Do koszyka</Button>
            </AuthorizedView>
          </Paper>
        ))}
      </Stack>
    );
  } else {
    return (
      <Box display="flex" flexDirection={'column'} alignItems="center" justifyContent="center">
        <Typography variant="h4">Książka nie jest dostępna</Typography>
      </Box>
    );
  }
}

export default LibrariesStack;
