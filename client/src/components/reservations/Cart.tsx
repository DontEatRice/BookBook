import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CartViewModelType } from '../../models/CartViewModel';
import { useCartStore } from '../../store';
import { getCart, removeFromCart } from '../../api/cart';
import { makeReservation } from '../../api/reservation';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useAlert from '../../utils/alerts/useAlert';
import { translateErrorCode } from '../../utils/functions/utilFunctions';
import { ApiResponseError } from '../../utils/utils';

export default function Cart() {
  const cartStore = useCartStore();
  const theme = useTheme();
  const [error, setError] = useState<string>('');
  const { showSuccess, handleError } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [libraryId, setLibraryId] = useState('');
  const queryClient = useQueryClient();

  const handleClickOpen = (id: string) => {
    setLibraryId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setLibraryId('');
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    makeReservationMutation({ libraryId });
  };

  const { data, status, refetch } = useQuery({ queryKey: ['cart'], queryFn: getCart });

  refetch();
  const removeItem = async (bookId: string) => {
    await removeFromCart(bookId);
    await refetch();
    cartStore.toggleIsChanged();
  };

  const { mutate: makeReservationMutation } = useMutation({
    mutationFn: makeReservation,
    onSuccess: async () => {
      cartStore.toggleCart();
      showSuccess({ message: 'Rezerwacja została złożona' });
      setLoading(true);
      await refetch();
      cartStore.toggleIsChanged();
      setError('');
      setLoading(false);
      queryClient.invalidateQueries(['reservationsForUser']);
    },
    onError: (e) => {
      if (e instanceof ApiResponseError) {
        setError(translateErrorCode(e.error.code));
      } else {
        handleError(e);
      }
      setLoading(false);
    },
  });

  return (
    <div>
      <h1>Koszyk</h1>
      <Button
        sx={{
          marginY: 2,
          backgroundColor: theme.palette.primary.light,
          color: 'black',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        onClick={() => cartStore.toggleCart()}>
        Zamknij
      </Button>

      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <CartTable data={data} removeItem={removeItem} />}
    </div>
  );

  function CartTable({
    data,
    removeItem,
  }: {
    data: CartViewModelType;
    removeItem: (bookId: string) => void;
  }) {
    const libraries = data.librariesInCart;

    return (
      <Box zIndex={5}>
        {loading ? (
          <Typography variant="h3">Ładowanie...</Typography>
        ) : (
          <div>
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            <List>
              {libraries.map((libraryInCart) => (
                <div key={libraryInCart.library.id}>
                  <ListItem
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                      padding: 2,
                    }}>
                    <ListItemText
                      primary={`${libraryInCart.library.name}`}
                      secondary={`${libraryInCart.library.address.city}, ${libraryInCart.library.address.street} ${libraryInCart.library.address.number}`}
                      key={libraryInCart.library.id}
                    />
                    <List>
                      {libraryInCart.books.map((book) => (
                        <ListItem
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                          }}
                          key={book.id}>
                          <Button onClick={() => removeItem(book.id)}>x</Button>
                          <ListItemText primary={book.title}></ListItemText>
                        </ListItem>
                      ))}
                      <Button
                        sx={{
                          backgroundColor: theme.palette.primary.light,
                          color: 'black',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                          },
                        }}
                        onClick={() => handleClickOpen(libraryInCart.library.id)}>
                        Złóż rezerwację
                      </Button>

                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">{'Potwierdzenie rezerwacji'}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Czy na pewno chcesz złożyć rezerwację?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose} color="primary">
                            Anuluj
                          </Button>
                          <Button onClick={handleConfirm} color="primary" autoFocus>
                            Potwierdź
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </List>
                  </ListItem>
                </div>
              ))}
            </List>
          </div>
        )}
      </Box>
    );
  }
}
