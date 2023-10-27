import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { CartViewModelType } from '../../models/CartViewModel';
import { useCartStore } from '../../store';
import { getCart, removeFromCart } from '../../api/cart';
import { makeReservation } from '../../api/reservation';
import { useState } from 'react';
import { getBook } from '../../api/book';

export default function Cart() {
  const cartStore = useCartStore();
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
      <Button onClick={() => cartStore.toggleCart()}>Close</Button>

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
            {libraries.map((libraryInCart) => (
              <div
                key={libraryInCart.library.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid black',
                  margin: '10px',
                  padding: '10px',
                }}>
                <div>
                  <p>Biblioteka: {libraryInCart.library.name}</p>
                  <p>Ksiąki:</p>
                  {libraryInCart.books.map((book) => (
                    <div
                      key={book.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: '5px',
                        padding: '5px',
                      }}>
                      <Button onClick={() => removeItem(book.id)}>X</Button>
                      <p>{book.title}</p>
                    </div>
                  ))}
                  {
                    <Button onClick={() => handleMakeReservation(libraryInCart.library.id)}>
                      Make reservation
                    </Button>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

