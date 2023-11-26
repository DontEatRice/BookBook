import { ChangePasswordRequestType } from '../models/ChangePasswordRequest';
import UserDetailViewModel from '../models/user/UserDetailViewModel';
import { handleBadResponse } from '../utils/utils';
import { getAuthToken } from './auth';

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
    await handleBadResponse(result);
  }
  return;
}

export async function myAccount() {
  const auth = await getAuthToken();
  const result = await fetch(base + '/me', {
    credentials: 'include',
    headers: new Headers({
      Authorization: auth,
      'Content-Type': 'application/json',
    }),
  });
  if (!result.ok) {
    await handleBadResponse(result);
  }
  return UserDetailViewModel.parse(await result.json());
}
