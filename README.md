# Healthcare Voice AI Receptionist Backend

Backend service for an AI-powered healthcare receptionist system. The application manages doctors, appointment slots, patients, and appointments through REST APIs that can be integrated with voice platforms such as Ringg AI.

## Features

- Doctor management
- Appointment slot availability lookup
- Appointment booking
- Appointment cancellation
- Appointment rescheduling
- Patient management
- PostgreSQL database with Prisma ORM
- RESTful API architecture
- Voice AI integration ready

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JavaScript (ES Modules)

---

## Project Structure

backend/

├── prisma/

│ ├── schema.prisma

│ └── seed.js

├── src/

│ ├── controllers/

│ ├── routes/

│ ├── services/

│ ├── tools/

│ ├── prompts/

│ ├── lib/

│ └── app.js

├── .env

├── .env.example

├── package.json

└── prisma.config.ts

---

## Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_db"
PORT=3000
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Seed Database

```bash
npx prisma db seed
```

### 6. Start Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs at:

```text
http://localhost:3000
```

---

## API Endpoints

### Doctors

Get all doctors

```http
GET /api/doctors
```

---

### Available Slots

Get available slots for a doctor on a specific date.

```http
GET /api/slots?doctorId=1&date=2026-06-22
```

Example Response:

```json
{
  "success": true,
  "count": 32,
  "data": [
    {
      "id": 97,
      "startTime": "2026-06-22T03:30:00.000Z"
    }
  ]
}
```

---

### Create Appointment

```http
POST /api/appointments
```

Request:

```json
{
  "slotId": 97,
  "patientName": "Raj BK",
  "phone": "+13065551234",
  "email": "raj@example.com"
}
```

---

### Get Appointment

```http
GET /api/appointments/:id
```

Example:

```http
GET /api/appointments/1
```

---

### Cancel Appointment

```http
PATCH /api/appointments/:id/cancel
```

Example:

```http
PATCH /api/appointments/1/cancel
```

---

### Reschedule Appointment

```http
PATCH /api/appointments/:id/reschedule
```

Request:

```json
{
  "newSlotId": 101
}
```

---

## Business Rules

### Appointment Booking

- Appointment can only be created for AVAILABLE slots.
- Slot status changes to BOOKED after successful booking.
- Existing patients are reused based on phone number.

### Appointment Cancellation

- Appointment status changes to CANCELLED.
- Slot becomes AVAILABLE only when no active appointments remain for that slot.

### Appointment Rescheduling

- New slot must exist.
- New slot must be AVAILABLE.
- Appointment status changes to RESCHEDULED.
- Previous slot becomes AVAILABLE when no active appointments remain.

---

## Voice AI Integration

This backend is designed to integrate with conversational AI platforms such as Ringg AI.

Suggested tools:

- find_doctors
- find_slots
- book_appointment
- get_appointment
- cancel_appointment
- reschedule_appointment

The APIs can be exposed publicly and connected as API tools within the voice assistant platform.

---

## Future Improvements

- Request validation using Zod
- Global error handling middleware
- Swagger/OpenAPI documentation
- Unit and integration testing
- Authentication and authorization
- Logging and monitoring
- AI conversation analytics

---

## Author

Subhash Rana
