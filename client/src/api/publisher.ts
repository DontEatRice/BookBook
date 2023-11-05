import { AddPublisherType } from '../models/AddPublisher';
import PublisherViewModel from '../models/PublisherViewModel';
import { PaginationRequest, paginatedFetch, paginatedResponse } from '../utils/utils';

const base = import.meta.env.VITE_API_BASE_URL;
const PublisherSearchResponse = paginatedResponse(PublisherViewModel);

export const postPublisher = async (publisher: AddPublisherType) => {
  const response = await fetch(base + '/Publishers', {
    method: 'post',
    body: JSON.stringify(publisher),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  return response;
};

export async function getPublishers(body: PaginationRequest) {
  const response = await paginatedFetch(base + '/Publishers/search', body);
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return PublisherSearchResponse.parse(data);
}
