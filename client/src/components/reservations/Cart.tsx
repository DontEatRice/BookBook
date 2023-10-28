import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { CartViewModelType } from '../../models/CartViewModel';
import { useCartStore } from '../../store';
import { getCart, removeFromCart } from '../../api/cart';
import { makeReservation } from '../../api/reservation';
import { useState } from 'react';
import { getBook } from '../../api/book';
import { useTheme } from '@mui/material';

export default function Cart() {
  const cartStore = useCartStore();
  const theme = useTheme();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { data, status, refetch } = useQuery({ queryKey: ['cart'], queryFn: getCart });

  const removeItem = async (bookId: string) => {
    await removeFromCart(bookId);
    await refetch();
    cartStore.toggleIsChanged();
  };

  const handleMakeReservation = async (libraryId: string) => {
    try {
      setLoading(true);
      await makeReservation({ libraryId });
      await refetch();
      cartStore.toggleIsChanged();
      setError('');
      setSuccess('Rezerwacja została złożona!');
      setLoading(false);
    } catch (error) {
      const err = error as Error;
      const errorCode = err.message.split(':')[0];
      const resourceId = err.message.split(':')[1];
      switch (errorCode) {
        case 'CANNOT_MAKE_ANOTHER_RESERVATION':
          setError('Nie można złożyć drugiej rezerwacji dla tej samej biblioteki');
          break;
        case 'BOOK_NOT_FOUND': {
          const book = await getBook(resourceId);
          setError(`Książka ${book.title} nie została znaleziona`);
          break;
        }
        case 'BOOK_NOT_AVAILABLE': {
          const book = await getBook(resourceId);
          setError(`Książka "${book.title}" w tej chwili nie jest dostępna w tej bibliotece`);
          break;
        }
        default:
          setError(`Wystąpił nieznany błąd: ${errorCode}`);
          break;
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      <Button
        sx={{
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
      <div>
        {loading ? (
          <Typography variant="h3">Ładowanie...</Typography>
        ) : (
          <div>
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body1" color="green">
                {success}
              </Typography>
            )}
            <List>
              {libraries.map((libraryInCart) => (
                <>
                  <ListItem
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                    key={libraryInCart.library.id}>
                    <ListItemText
                      primary={`${libraryInCart.library.name}`}
                      secondary={`${libraryInCart.library.address.city}, ${libraryInCart.library.address.street} ${libraryInCart.library.address.number}`}
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
                        onClick={() => handleMakeReservation(libraryInCart.library.id)}>
                        Złóż rezerwację
                      </Button>
                    </List>
                  </ListItem>
                  <List></List>
                </>
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}

