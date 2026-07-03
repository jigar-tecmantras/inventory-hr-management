# Inventory HR Management

Simple inventory management for an IT company handled entirely by HR. This repository ships a Laravel API that drives a lightweight React + Vite frontend. No authentication is needed—HR inputs and views inventory items directly.

## Structure

- `backend/` – Laravel 10 API offering `GET /api/inventories` and `POST /api/inventories`.
- `frontend/` – Vite-powered React app that adds and lists inventory items.

## Getting started

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API listens on `http://127.0.0.1:8000` by default. If you change the host/port, update `frontend/.env` (see below).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, Vite runs on `http://localhost:5173`. The React app talks to `http://127.0.0.1:8000/api`. You can override the backend URL with a `.env` file in the `frontend/` directory.

## Deployment notes

- Enable CORS on the Laravel API (e.g., via `fruitcake/laravel-cors` or a custom middleware).
- Configure a persistent database and queue worker if you grow the HR workload beyond simple demos.
