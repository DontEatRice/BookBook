import { AddPublisherType } from '../models/AddPublisher';

const base = import.meta.env.VITE_API_BASE_URL;

export const postPublisher = async (publisher: AddPublisherType) => {
    const response = await fetch(base + '/Publishers', {
        method: 'post',
        body: JSON.stringify(publisher),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response;
};