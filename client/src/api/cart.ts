import { AddToCartType } from '../models/AddToCart';
import CartViewModel from '../models/CartViewModel';
import { handleBadResponse } from '../utils/utils';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;

export async function getCart() {
  const auth = await getAuthToken();
  const response = await fetch(base + '/cart', {
    headers: {
      Authorization: auth,
    },
  });
  const data = await response.json();
  if (data.code === 'CART_NOT_FOUND') {
    return { librariesInCart: [] };
  }
  return CartViewModel.parse(data);
}

export const addToCart = async (addToCart: AddToCartType) => {
  const auth = await getAuthToken();
  const response = await fetch(base + '/cart', {
    method: 'post',
    body: JSON.stringify(addToCart),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
};

export const removeFromCart = async (bookId: string) => {
  const auth = await getAuthToken();
  const response = await fetch(base + '/cart', {
    method: 'delete',
    body: JSON.stringify({ bookId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  return response;
};

export const getBookFromCart = async (bookId: string) => {
  const auth = await getAuthToken();
  const response = await fetch(base + '/cart', {
    body: JSON.stringify({ bookId }),
    headers: {
      Authorization: auth,
    },
  });
  const data = await response.json();
  return CartViewModel.parse(data);
};
