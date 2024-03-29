import Cart from './Cart';
import { useCartStore } from '../../store';
import { useTheme } from '@mui/material/styles';

export default function CartTab() {
  const theme = useTheme();
  const cartStore = useCartStore();
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100vh',
        left: '0px',
        top: '0px',
        backgroundColor: 'rgb(0 0 0 / 0.25)',
        zIndex: 100,
      }}
      onClick={() => cartStore.toggleCart()}>
      <div
        style={{
          position: 'absolute',
          right: '0px',
          top: '0px',
          height: '100vh',
          padding: '2rem',
          minWidth: '300px',
          backgroundColor: theme.palette.secondary.main,
          zIndex: 101,
        }}
        onClick={(e) => e.stopPropagation()}>
        <Cart />
      </div>
    </div>
  );
}

