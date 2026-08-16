# Automated tests

Run the complete suite from the repository root:

```bash
pnpm test
```

The command runs the backend unit tests, backend REST API tests, and frontend UI tests in sequence.

## Backend unit tests

- Map-file parsing for every supported map symbol and rejection of unsupported symbols.
- Default input files, explicit `--map`/`--bookings` paths, and unreadable input-file errors.
- Booking service map retrieval and a successful validated booking.

## Backend REST API tests

- Map retrieval.
- Successful booking and the resulting booked map state.
- Invalid room/name validation, non-cabana booking attempts, missing tiles, and mismatched coordinates.
- Conflict handling when the same cabana is booked twice.

## Frontend UI tests

- Loading and rendering API-supplied map data.
- Available and unavailable cabana interaction.
- Local required-field validation and API guest-validation errors.
- Retry after a map-loading failure.
- Disabled duplicate submission while a booking is pending.
- Booking confirmation and the immediate booked-state map update.
