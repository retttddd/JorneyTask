import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { MapTile } from './lib/booking-api'

const availableCabana: MapTile = {
  id: 'cabana-1-1',
  coordinates: { x: 1, y: 1 },
  name: 'cabana',
  vacant: true,
}

const bookedCabana: MapTile = {
  id: 'cabana-2-1',
  coordinates: { x: 2, y: 1 },
  name: 'cabana',
  vacant: false,
}

const mapTiles: MapTile[] = [
  availableCabana,
  bookedCabana,
  { id: 'pool-0-0', coordinates: { x: 0, y: 0 }, name: 'pool', vacant: false },
]

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('App', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue(jsonResponse(mapTiles))
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders mocked map data and explains when a selected cabana is unavailable', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('Loading resort map…')).toBeInTheDocument()
    await user.click(await screen.findByRole('button', { name: 'View unavailable cabana cabana-2-1' }))

    expect(screen.getByRole('heading', { name: 'cabana-2-1 is unavailable' })).toBeInTheDocument()
    expect(screen.getByText('Cabana cabana-2-1 is not available. Please select another cabana on the map.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Book cabana' })).not.toBeInTheDocument()
  })

  it('validates guest details locally without submitting a booking request', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('button', { name: 'Select available cabana cabana-1-1' }))
    await user.click(screen.getByRole('button', { name: 'Book cabana' }))

    expect(await screen.findByText('Enter your room number.')).toBeInTheDocument()
    expect(screen.getByText('Enter the guest name.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('shows a retryable error when loading the map fails', async () => {
    const user = userEvent.setup()
    fetchMock.mockRejectedValueOnce(new Error('Network unavailable')).mockResolvedValueOnce(jsonResponse(mapTiles))
    render(<App />)

    expect(await screen.findByText('Network unavailable')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('button', { name: 'Select available cabana cabana-1-1' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('shows the API validation message for invalid guest details', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce(jsonResponse(mapTiles)).mockResolvedValueOnce(
      jsonResponse({ message: 'Room number and guest name do not match.' }, 400),
    )
    render(<App />)

    await user.click(await screen.findByRole('button', { name: 'Select available cabana cabana-1-1' }))
    await user.type(screen.getByLabelText('Room number'), '999')
    await user.type(screen.getByLabelText('Guest name'), 'Unknown Guest')
    await user.click(screen.getByRole('button', { name: 'Book cabana' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Room number and guest name do not match.')
    expect(screen.getByRole('button', { name: 'Book cabana' })).toBeEnabled()
  })

  it('disables booking submission while the request is in progress', async () => {
    const user = userEvent.setup()
    let resolveBooking: (response: Response) => void = () => undefined
    const bookingResponse = new Promise<Response>((resolve) => {
      resolveBooking = resolve
    })
    fetchMock.mockResolvedValueOnce(jsonResponse(mapTiles)).mockReturnValueOnce(bookingResponse)
    render(<App />)

    await user.click(await screen.findByRole('button', { name: 'Select available cabana cabana-1-1' }))
    await user.type(screen.getByLabelText('Room number'), '101')
    await user.type(screen.getByLabelText('Guest name'), 'Alice Smith')
    const submitButton = screen.getByRole('button', { name: 'Book cabana' })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByLabelText('Room number')).toBeDisabled()
    resolveBooking(jsonResponse({ ...availableCabana, vacant: false }, 201))

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Booking confirmed' })).toBeInTheDocument())
  })

  it('books an available cabana using mocked data and immediately shows it as booked', async () => {
    const user = userEvent.setup()
    const newlyBookedCabana = { ...availableCabana, vacant: false }
    fetchMock.mockResolvedValueOnce(jsonResponse(mapTiles)).mockResolvedValueOnce(jsonResponse(newlyBookedCabana, 201))
    render(<App />)

    await user.click(await screen.findByRole('button', { name: 'Select available cabana cabana-1-1' }))
    await user.type(screen.getByLabelText('Room number'), '101')
    await user.type(screen.getByLabelText('Guest name'), 'Alice Smith')
    await user.click(screen.getByRole('button', { name: 'Book cabana' }))

    expect(await screen.findByRole('heading', { name: 'Booking confirmed' })).toBeInTheDocument()
    expect(screen.getByText('cabana-1-1 has been booked.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenLastCalledWith('/api/booking/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tile: { id: 'cabana-1-1', coordinates: { x: 1, y: 1 } },
        user: { room: '101', guestName: 'Alice Smith' },
      }),
    })

    await user.click(screen.getByRole('button', { name: 'Back to map' }))
    expect(screen.getByRole('button', { name: 'View unavailable cabana cabana-1-1' })).toBeInTheDocument()
  })
})
