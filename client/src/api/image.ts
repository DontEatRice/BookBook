import { UploadImageType } from '../models/UploadImage';

const base = import.meta.env.VITE_API_BASE_URL;

export const uploadImage = async (image: UploadImageType) => {
  const response = await fetch(base + '/Images/upload', {
    method: 'post',
    body: JSON.stringify(image),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response.headers.get('location');
};
