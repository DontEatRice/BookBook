import BookViewModel from '../models/BookViewModel';
import { ToggleBookInUserListType } from '../models/ToggleBookInUserList';
import ReviewInUserProfileViewModel from '../models/user/ReviewInUserProfileViewModel';
import UserProfileViewModel from '../models/user/UserProfileViewModel';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
export const ReviewInUserProfilePaginated = paginatedResponse(ReviewInUserProfileViewModel);

export const toggleBookInUserList = async (toggleBook: ToggleBookInUserListType) => {
  const auth = await getAuthToken();
  const response = await fetch(base + '/User/toggle-observe', {
    method: 'post',
    body: JSON.stringify(toggleBook),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

const UserBooksPaginated = paginatedResponse(BookViewModel);
export async function getUserBooks(body: PaginationRequest) {
  const auth = await getAuthToken();
  const response = await paginatedFetch(base + '/User/user-books', body, auth);

  if (!response.ok) {
    await handleBadResponse(response);
  }

  const data = await response.json();
  return UserBooksPaginated.parse(data);
}

export async function getUserProfile(id: string) {
  const response = await fetch(base + '/user/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });

  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  return UserProfileViewModel.parse(data);
}

export async function getUserReviews(
  args: PaginationRequest & {
    userId: string;
  }
) {
  const response = await paginatedFetch(base + '/User/' + args.userId + '/reviews', args);
  if (!response.ok) {
    handleBadResponse(response);
  }
  const data = await response.json();
  return ReviewInUserProfilePaginated.parse(data);
}
