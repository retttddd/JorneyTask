import { readFileSync } from 'node:fs';

export interface BookingGuest {
  room: string;
  guestName: string;
}

export function createBookingGuests(
  bookingsPath: string,
): Map<string, BookingGuest> {
  const guests = JSON.parse(readFileSync(bookingsPath, 'utf8')) as BookingGuest[];

  return new Map(guests.map((guest) => [guest.room, guest]));
}
