import { ChangePasswordRequestType } from '../models/ChangePasswordRequest';
import { AuthError, getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL + '/Account';

export async function changePassword({ oldPassword, newPassword }: ChangePasswordRequestType) {
  const auth = await getAuthToken();
  const result = await fetch(base + '/change-password', {
    method: 'patch',
    body: JSON.stringify({ oldPassword, newPassword }),
    credentials: 'include',
    headers: new Headers({
      Authorization: auth,
      'Content-Type': 'application/json',
    }),
  });
  if (!result.ok) {
    const body = await result.json();
    if (body.code) {
      // TODO parsowanie za pomocą zoda i custom error
      throw new AuthError(body.code);
    }
    throw new Error(await result.text());
  }
  return;
}
