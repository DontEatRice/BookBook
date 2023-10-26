import { ChangePasswordType } from '../models/ChangePassword';

const base = import.meta.env.VITE_API_BASE_URL + '/Account';

export async function changePassword(request: ChangePasswordType) {
  return request;
}
