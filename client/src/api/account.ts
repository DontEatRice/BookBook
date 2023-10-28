import { ChangePasswordRequestType } from '../models/ChangePasswordRequest';

const base = import.meta.env.VITE_API_BASE_URL + '/Account';

export async function changePassword(request: ChangePasswordRequestType) {
  return request;
}
