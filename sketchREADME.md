I assume that guest validation should work this way: 
  1. Every W in map.ascii represents a cabana.
  2. Initially, all cabanas are available.
  3. bookings.json is actually the guest-validation list.
  4. When a guest successfully books a cabana, the backend stores that booking in memory.
  5.That cabana becomes unavailable until the server restarts.
