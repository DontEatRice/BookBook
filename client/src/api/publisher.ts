import { AddPublisherType } from '../models/AddPublisher';
import { UpdatePublisherType } from '../models/UpdatePublisher';
import PublisherViewModel from '../models/PublisherViewModel';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthTokenOrNull } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
const PublisherSearchResponse = paginatedResponse(PublisherViewModel);

export const postPublisher = async (publisher: AddPublisherType) => {
  const response = await fetch(base + '/Publishers', {
    method: 'post',
    body: JSON.stringify(publisher),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export const updatePublisher = async ({ id, publisher }: { id: string; publisher: UpdatePublisherType }) => {
  const response = await fetch(base + '/Publishers/' + id, {
    method: 'put',
    body: JSON.stringify(publisher),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export const deletePublisher = async (publisherId: string) => {
  const response = await fetch(base + '/Publishers/' + publisherId, {
    method: 'delete',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (!response.ok) {
    await handleBadResponse(response);
  }
  return response;
};

export async function getPublishers(body: PaginationRequest) {
  const response = await paginatedFetch(base + '/Publishers/search', body);
  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  //https://zod.dev/?id=basic-usage
  //można też użyć funkcji .safeParse(data), która nie rzucałaby błędem
  //w takim przypadku można by coś zlogować i wyświetlić stosowny komunikat
  return PublisherSearchResponse.parse(data);
}

export async function getPublisher(id: string) {
  //endpoint powinien działać zarówno dla zalogowanego i anonima

  const response = await fetch(base + '/Publishers/' + id, {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: (await getAuthTokenOrNull()) ?? '',
    }),
  });
  const data = await response.json();
  return PublisherViewModel.parse(data);
}
