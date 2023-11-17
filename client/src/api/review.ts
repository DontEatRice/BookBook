import { AddReviewType } from '../models/AddReview';
import ReviewViewModel from '../models/ReviewViewModel';
import { UpdateReviewType } from '../models/UpdateReview';
import { paginatedFetch, handleBadResponse } from '../utils/utils';
import { PaginationRequest } from '../utils/constants';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
const ReviewSearchResponse = paginatedResponse(ReviewViewModel);

export async function getReviews(bookId: string, body: PaginationRequest) {
    const response = await paginatedFetch(base + '/Books/' + bookId + '/Reviews/search', body);
    const data = await response.json();

    if (!response.ok) {
        await handleBadResponse(response);
      }
    return ReviewSearchResponse.parse(data);
}

/*
export async function getReviews({ bookId, body } : { bookId: string; body: PaginationRequest}) {
    const response = await paginatedFetch(base + '/Books/' + bookId + '/Reviews/search', body);
    const data = await response.json();
    return ReviewSearchResponse.parse(data);
}
*/

export const postReview = async (review: AddReviewType) => {
  const auth = await getAuthToken();

  const response = await fetch(base + '/Reviews', {
    method: 'post',
    body: JSON.stringify(review),
    headers: new Headers({ 'Content-Type': 'application/json', Authorization: auth }),
  });
  return response;
};

export const updateReview = async (review: UpdateReviewType) => {
  const response = await fetch(base + '/Reviews', {
    method: 'put',
    body: JSON.stringify(review),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export const deleteReview = async (reviewId: string) => {
  const response = await fetch(base + '/Reviews/' + reviewId, {
    method: 'delete',
    body: JSON.stringify(reviewId),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};
