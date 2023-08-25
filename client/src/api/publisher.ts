import { AddPublisherType } from '../models/AddPublisher';
import PublisherViewModel from '../models/PublisherViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export const postPublisher = async (publisher: AddPublisherType) => {
    const response = await fetch(base + '/Publishers', {
        method: 'post',
        body: JSON.stringify(publisher),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response;
};

export async function getPublishers() {
    const response = await fetch(base + '/Publishers');
    const data = await response.json();
    //https://zod.dev/?id=basic-usage
    //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
    //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
    return PublisherViewModel.array().parse(data);
  }