import { AddBookType } from '../models/AddBook';
import BookViewModel from '../models/BookViewModel';

const base = import.meta.env.VITE_API_BASE_URL;

export const postBook = async (book: AddBookType) => {
    const response = await fetch(base + '/Books', {
        method: 'post',
        body: JSON.stringify(book),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return response;
};

export async function getBooks() {
    const response = await fetch(base + '/Books');
    const data = await response.json();
    //https://zod.dev/?id=basic-usage
    //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
    //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
    return BookViewModel.array().parse(data);
}
