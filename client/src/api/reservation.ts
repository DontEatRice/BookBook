import { MakeReservationType } from '../models/MakeReservation';
import ReservationViewModel from '../models/ReservationViewModel';
import { getAuthToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL;

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

export async function getReservationsForUser() {
  const auth = await getAuthToken();
  const response = await fetch(base + '/reservations', {
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
  });
  const data = await response.json();

  return ReservationViewModel.array().parse(data);
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

// admin

export async function getReservations(libraryId: string) {
  const auth = await getAuthToken();
  const response = await fetch(base + '/reservations/admin', {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: auth,
    }),
    body: JSON.stringify({ libraryId }),
  });
  const data = await response.json();
  return ReservationViewModel.array().parse(data);
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

