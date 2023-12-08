import { UploadImageType } from '../models/UploadImage';
import { handleBadResponse } from '../utils/utils';

const base = import.meta.env.VITE_API_BASE_URL;

export const uploadImage = async (image: UploadImageType) => {
  const response = await fetch(base + '/Images/upload', {
    method: 'post',
    body: JSON.stringify(image),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return (await response.json()) as string;
};
