import { useCartStore } from '../../src/store';
import { getCart, removeFromCart } from '../api/cart';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CartViewModelType } from '../models/CartViewModel';
import { useQuery } from '@tanstack/react-query';

export default function Cart() {
  const cartStore = useCartStore();

  const { data, status, refetch } = useQuery({ queryKey: ['cart'], queryFn: getCart });

  const removeItem = async (bookId: string) => {
    await removeFromCart(bookId);
    await refetch();
    cartStore.toggleIsChanged();
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
}
function CartTable({ data, removeItem }: { data: CartViewModelType; removeItem: (bookId: string) => void }) {
  const libraries = data.librariesInCart;

  return (
    <div>
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
            {<Button>Make reservation</Button>}
          </div>
        </div>
      ))}
    </div>
  );
}

