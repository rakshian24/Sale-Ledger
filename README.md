# SaleLedger

**SaleLedger** is a full-stack daily earnings and expense tracking Progressive Web App.

It helps small business owners track daily cash collections, PhonePe/UPI collections, total earnings, daily expenses, and profit. The app uses a Node.js + Express + TypeScript backend, MongoDB with Mongoose, JWT authentication, and a React + TypeScript + Vite PWA frontend.

The frontend shows live server data when online and shows the last synced server data when offline.

## Features

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Register/login/profile APIs
- Password hashing with bcrypt
- Protected REST APIs
- Create daily entry
- Read all entries by month/year
- Read single entry
- Update entry
- Delete entry
- Monthly summary API
- User-specific data access
- Server-side validation
- Centralized error handling

### Frontend

- React + TypeScript + Vite
- PWA support
- Installable on Android/iOS/Desktop
- Offline fallback
- Shows last synced data when offline
- Login/register flow
- Dashboard with monthly filters
- Add/edit/delete daily entries
- Holiday support
- Summary cards
- Responsive table
- Local cache using localStorage

## App Formula

```txt
Total = Cash + PhonePe
Profit = Total - Expense
```

Monthly summary:

```txt
Total Cash = Sum of cash
Total PhonePe = Sum of PhonePe
Total Collection = Sum of total
Total Expense = Sum of expense
Total Profit = Total Collection - Total Expense
```

## Project Structure

```txt
saleledger-fullstack/
  README.md
  package.json
  server/
  client/
```

## Prerequisites

- Node.js 20+
- MongoDB local or MongoDB Atlas

## Setup

Install all dependencies from root:

```bash
npm run install:all
```

Create backend env:

```bash
cd server
cp .env.example .env
```

Create frontend env:

```bash
cd ../client
cp .env.example .env
```

## Run Locally

From root:

```bash
npm run dev
```

Or separately:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Backend:

```txt
http://localhost:5001
```

Frontend:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
```

## REST API

### Auth

Base URL:

```txt
/api/auth
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register user |
| POST | `/login` | Login user |
| GET | `/me` | Get logged-in user |

### Entries

Base URL:

```txt
/api/entries
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get entries, optionally by month/year |
| POST | `/` | Create entry |
| GET | `/summary/monthly?month=4&year=2026` | Monthly summary |
| GET | `/:id` | Get entry by id |
| PUT | `/:id` | Update entry |
| DELETE | `/:id` | Delete entry |

## Offline Behavior

### Online

- Fetches live entries from the server.
- Saves the latest fetched entries locally.
- Allows add/edit/delete.
- Updates cache after successful server response.

### Offline

- Shows offline banner.
- Displays the last synced entries from localStorage.
- Disables add/edit/delete for MVP.
- Keeps the app usable for viewing records and totals.

## Tagline

```txt
Track daily earnings, expenses, and profit with clarity.
```
