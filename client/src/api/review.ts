import { AddReviewType } from '../models/AddReview';

const base = import.meta.env.VITE_API_BASE_URL;

export const postReview = async (review: AddReviewType) => {
    const response = await fetch(base + '/Reviews', {
        method: 'post',
        body: JSON.stringify(review),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response;
};