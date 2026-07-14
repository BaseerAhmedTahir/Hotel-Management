# Hotel Booking Management System 🏨

A hotel operations dashboard for managing rooms, guests, bookings, payments, and reports — built with Next.js and Microsoft SQL Server.

## The problem

Front-desk staff need one place to see room availability, check guests in and out, take payments, and pull revenue reports. This app puts all of that behind a single dashboard backed by a normalized SQL Server database, instead of separate spreadsheets for rooms, guests, and payments.

## Features

- **Dashboard** — at-a-glance totals for rooms, guests, bookings, and paid revenue
- **Rooms** — manage room inventory and availability
- **Guests** — guest records and history
- **Bookings** — create bookings and run check-in / check-out actions
- **Payments** — record and track payments against bookings
- **Reports** — revenue and occupancy reporting

## Tech stack

- **Framework:** Next.js (App Router), React
- **Database:** Microsoft SQL Server (`mssql` / `msnodesqlv8`)
- **Styling:** Tailwind CSS
- **Icons:** Lucide

## Architecture

The Next.js App Router serves both the UI (`src/app/*/page.js`) and the REST API (`src/app/api/*/route.js`). API routes query SQL Server through a pooled connection in `src/lib/db.js`.

```
src/
├── app/
│   ├── api/          # bookings, guests, payments, rooms, reports, dashboard
│   ├── bookings/     # UI pages
│   ├── guests/
│   ├── payments/
│   ├── reports/
│   └── rooms/
├── components/       # Navbar
└── lib/db.js         # SQL Server connection pool
```

## Getting started

### Prerequisites

- Node.js 18+
- A running Microsoft SQL Server instance with the hotel database schema

### Setup

```bash
git clone https://github.com/BaseerAhmedTahir/Hotel-Management.git
cd Hotel-Management
npm install
```

Configure the database connection via environment variables (create `.env.local`):

```env
DB_SERVER=localhost
DB_NAME=HotelBookingManagementSystem
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

> **Note:** connection settings currently live in `src/lib/db.js`. Move them to the environment variables above before deploying — never commit database credentials.

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
