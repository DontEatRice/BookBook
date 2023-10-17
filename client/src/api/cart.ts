import { AddToCartType } from '../models/AddToCart';
import CartViewModel from '../models/CartViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export async function getCart() {
  const response = await fetch(base + '/cart', {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJSZWZyZXNoVG9rZW4iLCJqdGkiOiIxNjUwOTI3Ni05ZThmLTRhMzYtOTViZS1mNmJkMjk3ZDRkYzMiLCJzdWIiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJlbWFpbCI6ImpnQGdtYWlsLmNvbSIsImlkZW50aXR5aWQiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTY5NzUyNzcyNywiZXhwIjoxNjk3NTMxMzI3LCJpYXQiOjE2OTc1Mjc3Mjd9.YB77I6UbORYKzx9YWrMNnYdeowazfO5XhfSiB4AC6Wk`,
    },
  });
  const data = await response.json();
  if (data.code === 'CART_NOT_FOUND') {
    return { librariesInCart: [] };
  }
  return CartViewModel.parse(data);
}

export const addToCart = async (addToCart: AddToCartType) => {
  const response = await fetch(base + '/cart', {
    method: 'post',
    body: JSON.stringify(addToCart),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJSZWZyZXNoVG9rZW4iLCJqdGkiOiIxNjUwOTI3Ni05ZThmLTRhMzYtOTViZS1mNmJkMjk3ZDRkYzMiLCJzdWIiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJlbWFpbCI6ImpnQGdtYWlsLmNvbSIsImlkZW50aXR5aWQiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTY5NzUyNzcyNywiZXhwIjoxNjk3NTMxMzI3LCJpYXQiOjE2OTc1Mjc3Mjd9.YB77I6UbORYKzx9YWrMNnYdeowazfO5XhfSiB4AC6Wk`,
    }),
  });
  if (response.status !== 200) {
    const data = await response.json();
    throw new Error(data.code);
  }
};

export const removeFromCart = async (bookId: string) => {
  const response = await fetch(base + '/cart', {
    method: 'delete',
    body: JSON.stringify({ bookId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJSZWZyZXNoVG9rZW4iLCJqdGkiOiIxNjUwOTI3Ni05ZThmLTRhMzYtOTViZS1mNmJkMjk3ZDRkYzMiLCJzdWIiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJlbWFpbCI6ImpnQGdtYWlsLmNvbSIsImlkZW50aXR5aWQiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTY5NzUyNzcyNywiZXhwIjoxNjk3NTMxMzI3LCJpYXQiOjE2OTc1Mjc3Mjd9.YB77I6UbORYKzx9YWrMNnYdeowazfO5XhfSiB4AC6Wk`,
    }),
  });
  return response;
};

export const getBookFromCart = async (bookId: string) => {
  const response = await fetch(base + '/cart', {
    body: JSON.stringify({ bookId }),
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJSZWZyZXNoVG9rZW4iLCJqdGkiOiI0MjhmZGY0Yy1jZmQwLTQ3NzctOTgzNS04M2I5MWJiMTliNDQiLCJzdWIiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJlbWFpbCI6ImpnQGdtYWlsLmNvbSIsImlkZW50aXR5aWQiOiIwM2JlYzFjNS1iMTUwLTRiMzQtYmJlYi1hNzBjYmVmZmViNjYiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTY5NzM3Njk3OCwiZXhwIjoxNjk3MzgwNTc4LCJpYXQiOjE2OTczNzY5Nzh9.pj2Kg5xenYbogddGdDGqpYi03ga9XmXD-0LTmOq_XCg`,
    },
  });
  const data = await response.json();
  return CartViewModel.parse(data);
};

