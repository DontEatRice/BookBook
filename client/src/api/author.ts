import { AddAuthorType } from '../models/AddAuthor';

const base = import.meta.env.VITE_API_BASE_URL;

export const postAuthor = async (author: AddAuthorType) => {
  const response = await fetch(base + '/Authors', {
    method: 'post',
    body: JSON.stringify(author),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};
