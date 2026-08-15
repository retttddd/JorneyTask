import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowStraight } from '../icons/arrowStraight'
import { Cabana } from '../icons/cabana'
import { HouseChimney } from '../icons/houseChimney'
import { Pool } from '../icons/pool'
import { ResortMap } from '@/components/Map'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { bookCabana, getMap, type MapTile } from '@/lib/booking-api'
import './App.css'

const guestDetailsSchema = z.object({
  roomNumber: z.string().trim().min(1, 'Enter your room number.'),
  guestName: z.string().trim().min(1, 'Enter the guest name.'),
})

type GuestDetails = z.infer<typeof guestDetailsSchema>

function App() {
  const [tiles, setTiles] = useState<MapTile[]>([])
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedCabana, setSelectedCabana] = useState<MapTile | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingConfirmation, setBookingConfirmation] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const form = useForm<GuestDetails>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      roomNumber: '',
      guestName: '',
    },
  })

  const applyMapTiles = (mapTiles: MapTile[]) => {
    setTiles(mapTiles)
    setSelectedCabana((current) => mapTiles.find((tile) => tile.id === current?.id) ?? null)
  }

  useEffect(() => {
    void getMap()
      .then((mapTiles) => {
        applyMapTiles(mapTiles)
      })
      .catch((reason: unknown) => {
        setMapError(reason instanceof Error ? reason.message : 'The resort map is unavailable. Please try again.')
      })
  }, [])

  const loadMap = () => {
    setMapError(null)
    void getMap()
      .then(applyMapTiles)
      .catch((reason: unknown) => {
        setMapError(reason instanceof Error ? reason.message : 'The resort map is unavailable. Please try again.')
      })
  }

  const selectCabana = (cabana: MapTile) => {
    setSelectedCabana((current) => current?.id === cabana.id ? null : cabana)
    setBookingError(null)
    setBookingConfirmation(null)
    form.reset()
  }

  const bookSelectedCabana = async ({ roomNumber, guestName }: GuestDetails) => {
    if (!selectedCabana) {
      setBookingError('Select an available cabana before booking.')
      return
    }

    setIsBooking(true)
    setBookingError(null)
    setBookingConfirmation(null)

    try {
      const bookedCabana = await bookCabana(selectedCabana, { room: roomNumber, guestName })
      setTiles((currentTiles) => currentTiles.map((tile) => tile.id === bookedCabana.id ? bookedCabana : tile))
      setSelectedCabana(bookedCabana)
      setBookingConfirmation(`${bookedCabana.id} has been booked.`)
      form.reset()
    } catch (reason: unknown) {
      setBookingError(reason instanceof Error ? reason.message : 'Unable to book this cabana. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Cabana Booking</h1>
      </header>

      <div className="workspace">
        <section className="map-section" aria-label="Resort map">
          <ResortMap
            tiles={tiles}
            selectedCabanaId={selectedCabana?.id ?? null}
            onCabanaSelect={selectCabana}
            error={mapError}
            onRetry={loadMap}
          />
        </section>

        <aside className="details-panel" aria-label="Map details">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" className="legend-trigger" />}>
              Legend
            </PopoverTrigger>
            <PopoverContent align="end" className="legend-popover">
              <PopoverHeader>
                <PopoverTitle>Map legend</PopoverTitle>
              </PopoverHeader>
              <ul className="legend-list">
                <li><span className="legend-mark"><Cabana aria-hidden="true" /></span> Cabana</li>
                <li><span className="legend-mark"><Pool aria-hidden="true" /></span> Pool</li>
                <li><span className="legend-mark"><ArrowStraight aria-hidden="true" /></span> Path</li>
                <li><span className="legend-mark"><HouseChimney aria-hidden="true" /></span> Chalet</li>
              </ul>
            </PopoverContent>
          </Popover>

          <section
            className={`panel-section booking-section${selectedCabana ? '' : ' booking-section--hidden'}`}
            aria-labelledby="booking-heading"
          >
            <h2 id="booking-heading">
              {selectedCabana
                ? selectedCabana.vacant
                  ? `Guest details for ${selectedCabana.id}`
                  : `${selectedCabana.id} is unavailable`
                : 'Select an available cabana'}
            </h2>
            {bookingError && <p className="booking-message booking-message--error" role="alert">{bookingError}</p>}
            {selectedCabana && !selectedCabana.vacant ? (
              <p className="booking-message" role="status">
                Cabana {selectedCabana.id} is not available. Please select another cabana on the map.
              </p>
            ) : selectedCabana ? (
              <form
                className="booking-form"
                noValidate
                onSubmit={form.handleSubmit(bookSelectedCabana)}
              >
                <FieldGroup>
                  <Controller
                    name="roomNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="room-number">Room number</FieldLabel>
                        <Input
                          {...field}
                          id="room-number"
                          inputMode="numeric"
                          placeholder="e.g. 101"
                          aria-invalid={fieldState.invalid}
                          disabled={isBooking}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="guestName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="guest-name">Guest name</FieldLabel>
                        <Input
                          {...field}
                          id="guest-name"
                          placeholder="e.g. Alice Smith"
                          autoComplete="name"
                          aria-invalid={fieldState.invalid}
                          disabled={isBooking}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button type="submit" size="lg" className="booking-submit" disabled={isBooking}>
                  {isBooking ? 'Booking…' : 'Book cabana'}
                </Button>
              </form>
            ) : null}
          </section>

          <AlertDialog
            open={Boolean(bookingConfirmation)}
            onOpenChange={(open) => {
              if (!open) setBookingConfirmation(null)
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Booking confirmed</AlertDialogTitle>
                <AlertDialogDescription>{bookingConfirmation}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Back to map</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </aside>
      </div>
    </main>
  )
}

export default App
