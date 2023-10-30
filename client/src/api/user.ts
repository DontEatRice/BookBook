import BookViewModel from "../models/BookViewModel";
import { ToggleBookInUserListType } from "../models/ToggleBookInUserList";
import { getAuthToken } from "./auth";

const base = import.meta.env.VITE_API_BASE_URL;

export const toggleBookInUserList = async(toggleBook: ToggleBookInUserListType) => {
    const auth = await getAuthToken();
    const response = await fetch(base + '/User/toggle-observe', {
        method: 'post',
        body: JSON.stringify(toggleBook),
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: auth
        })
    })
    return response;
}

export async function getUserBooks() {
    const auth = await getAuthToken();
    const response = await fetch(base + '/User/user-books', {
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: auth
        })
    });
    const data = await response.json();
    return BookViewModel.array().parse(data);
}