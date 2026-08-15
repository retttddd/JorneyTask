import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,

  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import './App.css'

const guestDetailsSchema = z.object({
  roomNumber: z.string().trim().min(1, 'Enter your room number.'),
  guestName: z.string().trim().min(1, 'Enter the guest name.'),
})

type GuestDetails = z.infer<typeof guestDetailsSchema>

function App() {
  const form = useForm<GuestDetails>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      roomNumber: '',
      guestName: '',
    },
  })

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Cabana Booking</h1>
      </header>

      <div className="workspace">
        <section className="map-section" aria-label="Resort map">
          <div className="map-placeholder">
            <span>Resort map</span>
          </div>
        </section>

        <aside className="details-panel" aria-label="Map details">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              Legend
            </PopoverTrigger>
            <PopoverContent align="end" className="legend-popover">
              <PopoverHeader>
                <PopoverTitle>Map legend</PopoverTitle>
              </PopoverHeader>
              <ul className="legend-list">
                <li><span className="legend-mark" aria-hidden="true">W</span> Cabana</li>
                <li><span className="legend-mark" aria-hidden="true">p</span> Pool</li>
                <li><span className="legend-mark" aria-hidden="true">#</span> Path</li>
                <li><span className="legend-mark" aria-hidden="true">c</span> Chalet</li>
              </ul>
            </PopoverContent>
          </Popover>

          <section className="panel-section booking-section" aria-labelledby="booking-heading">
            <h2 id="booking-heading">Guest details</h2>
            <form
              className="booking-form"
              noValidate
              onSubmit={form.handleSubmit(() => undefined)}
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
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button type="submit" size="lg" className="booking-submit">
                Book cabana
              </Button>
            </form>
          </section>
        </aside>
      </div>
    </main>
  )
}

export default App
