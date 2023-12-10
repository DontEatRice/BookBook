import { MakeReservationType } from '../models/MakeReservation';
import ReservationViewModel from '../models/ReservationViewModel';
import { PaginationRequest } from '../utils/constants';
import { handleBadResponse, paginatedFetch } from '../utils/utils';
import { paginatedResponse } from '../utils/zodSchemas';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;
const ReservationSearchResponse = paginatedResponse(ReservationViewModel);

export const makeReservation = async (makeReservation: MakeReservationType) => {
  const auth = await getAuthToken();
  const response = await fetch(base + '/reservations', {
    method: 'post',
    body: JSON.stringify(makeReservation),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });

  if (response.status !== 201) {
    const data = await response.json();
    throw new Error(`${data.code}:${data.resourceId}`);
  }
};

export async function getReservationsForUser(body: PaginationRequest) {
  const auth = await getAuthToken();
  const response = await paginatedFetch(base + '/reservations/search', body, auth);
  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();

  return ReservationSearchResponse.parse(data);
}

export async function cancelReservation(reservationId: string) {
  const auth = await getAuthToken();
  await fetch(base + `/reservations/${reservationId}/cancel`, {
    method: 'post',
    body: JSON.stringify({ reservationId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
}

export async function getReservation(reservationId: string) {
  const auth = await getAuthToken();
  const response = await fetch(base + `/reservations/${reservationId}`, {
    method: 'get',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });

  if (!response.ok) {
    await handleBadResponse(response);
  }
  const data = await response.json();
  return ReservationViewModel.parse(data);
}

// admin
export async function getReservations(args: PaginationRequest, libraryId: string | undefined) {
  const auth = await getAuthToken();
  const response = await fetch(base + '/reservations/admin/search', {
    method: 'post',
    body: JSON.stringify({ ...args, libraryId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return ReservationSearchResponse.parse(data);
}

export async function giveOutReservation(reservationId: string) {
  const auth = await getAuthToken();
  await fetch(base + `/reservations/admin/${reservationId}/give-out`, {
    method: 'post',
    body: JSON.stringify({ reservationId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
}

export async function cancelReservationByAdmin(reservationId: string) {
  const auth = await getAuthToken();
  await fetch(base + `/reservations/admin/${reservationId}/cancel`, {
    method: 'post',
    body: JSON.stringify({ reservationId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
}

export async function returnReservation(reservationId: string) {
  const auth = await getAuthToken();
  await fetch(base + `/reservations/admin/${reservationId}/return`, {
    method: 'post',
    body: JSON.stringify({ reservationId }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
}

