import { Button, Paper, Stack, Typography } from '@mui/material';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { useTheme } from '@emotion/react';
import { addToCart } from '../../api/cart';
import useAlert from '../../utils/alerts/useAlert';

function LibrariesStack({ libraries, bookId }: { libraries: LibraryViewModelType[]; bookId: string }) {
  const theme = useTheme();
  const { showError, showSuccess } = useAlert();
  const handleAddToCart = async (bookId: string, libraryId: string) => {
    try {
      await addToCart({ bookId, libraryId });
      //setError('');
      //setSuccess('Dodano do koszyka!');
      showSuccess({ message: 'Dodano do koszyka!' });
      //cartStore.toggleIsChanged();
    } catch (error) {
      const err = error as Error;
      //setSuccess('');
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
  return (
    <Stack direction={'column'} spacing={1} style={{ overflow: 'auto', height: 500 }}>
      {libraries.map((library) => (
        <Paper
          key={library.id}
          elevation={2}
          sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6">{library.name}</Typography>
            <Typography>
              {library.address.street + ' ' + library.address.number}
              {library.address.apartment == null ? '' : '/'}
              {library.address.apartment ?? ''}
            </Typography>
            <Typography>{library.address.postalCode + ' ' + library.address.city}</Typography>
          </div>
          <Button onClick={() => handleAddToCart(bookId, library.id)}>Do koszyka</Button>
        </Paper>
      ))}
    </Stack>
  );
}

export default LibrariesStack;
