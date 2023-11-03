import { AddReviewType } from '../models/AddReview';
import { UpdateReviewType } from '../models/UpdateReview';

const base = import.meta.env.VITE_API_BASE_URL;

export const postReview = async (review: AddReviewType) => {
    const response = await fetch(base + '/Reviews', {
        method: 'post',
        body: JSON.stringify(review),
        headers: new Headers({ 'Content-Type': 'application/json' }),
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