# Frontend contribution guide

## Purpose and scope

Build a polished, responsive, single-page React application for the Resort Map
take-home task. The app lets a guest inspect an API-driven resort map, select a
cabana, and complete a short booking flow.

- Use React, TypeScript, and Vite. Keep `strict` TypeScript intact; do not use
  `any` or suppress type errors.
- This is intentionally a lean interview exercise. Prefer small, explicit
  modules and native browser/React features over elaborate abstractions,
  state-management libraries, or speculative extensibility.
- There is no routing: keep the experience in one page and transition between
  map, selected-cabana, booking, error, and confirmation states in-place.
- The REST API is the source of truth for map data and booking outcomes. Do not
  duplicate fixture data in the UI or implement client-side guest validation.

## Design direction

Before implementing a visual change, write these three short notes in the PR
or task update:

1. **Visual thesis:** a calm, sunlit resort-map workspace that feels premium
   without becoming ornamental.
2. **Content plan:** map and legend first; selected-cabana context second;
   one-step booking or availability feedback third; concise confirmation last.
3. **Interaction thesis:** clear cabana hover/focus feedback, an in-place
   selection/booking transition, and a visible booked-state update after a
   successful API response.

This is a product surface, not a marketing page. Favour utility copy such as
“Available”, “Booked”, “Enter your room number”, and specific API error
messages over hero language. Use one restrained accent colour and calm surface
hierarchy. Avoid card mosaics, decorative gradients, and unrelated dashboard
widgets. A panel may use a bordered surface only when it carries an interaction
such as the booking form.

Use the supplied map tiles/assets as the visual map; do not recreate map art
with CSS, ASCII, or hand-drawn SVG. Make the selected, available, and booked
cabana states easy to distinguish without relying on colour alone.

## Responsive and accessible behaviour

Design and verify both mobile and desktop from the start:

- **Desktop:** map is the primary workspace; place the legend and booking
  context alongside it when space allows.
- **Mobile:** preserve a usable map viewport with horizontal/vertical map
  exploration where needed; place details and the form below the map or in an
  accessible sheet/dialog. Never require hover to discover a cabana state.
- Use semantic buttons for interactive cabanas, visible keyboard focus,
  descriptive labels, adequate contrast, and tap targets of roughly 44 × 44px
  where the tile size permits.
- Keep screen-reader feedback concise: announce a selected cabana, unavailable
  status, field validation errors, and booking success. Move focus to the
  relevant feedback or form heading when the interface changes state.
- Respect `prefers-reduced-motion`; any transition should be quick, optional,
  and reinforce state rather than decorate the page.

## Data, state, and errors

- Define API request/response types in TypeScript and isolate fetch calls in a
  small API module. Surface non-OK responses as short human-readable messages.
- Fetch the map on load and show a clear loading and retryable error state.
- After a successful booking, update the displayed cabana state immediately
  from the response. Refetch the map only when needed to reconcile the API.
- Prevent duplicate submissions while a booking is in flight. Keep form state
  local and reset it on success or when switching cabanas.
- Treat API data as untrusted at runtime: guard missing or malformed fields
  before rendering them.

## Components and styling

- Keep components small and task-oriented (for example `ResortMap`,
  `MapLegend`, `CabanaDetails`, and `BookingForm`). Do not make generic
  component frameworks for one-off UI.
- Prefer CSS modules or well-scoped CSS with design tokens for colour, spacing,
  type, and interaction states. Do not leave the Vite starter styles/assets in
  the finished UI.
- Use the project’s existing dependencies first. If standard accessible
  primitives (dialog, input, button, toast) would save time, **suggest shadcn/ui
  to the person prompting you before adding it**. Explain the small dependency
  and styling trade-off, and only install/use it after they agree. Do not add a
  general UI library by default.
- Use a familiar icon library only when an icon materially improves scanning;
  do not use emoji or improvised icon drawings.

## Quality bar

- Run the frontend checks available in `package.json` (`pnpm lint` and
  `pnpm build`) after changes.
- Add focused automated tests for loading/rendering map data, available versus
  unavailable cabana interaction, validation/API errors, successful booking,
  and the immediately updated booked state. Test user-visible behaviour rather
  than implementation details.
- Manually inspect at a narrow mobile width and a common desktop width. Check
  overflow, map usability, focus order, contrast, loading/errors, and the full
  booking flow before handoff.
