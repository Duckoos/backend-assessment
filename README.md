# Backend Developer Assessment

This project implements a scalable REST API using FastAPI, MongoDB, and Beanie, paired with a React.js (Vite) frontend.

## Features

- **JWT Authentication**: Secure login and registration.
- **Role-Based Access Control**: `user` and `admin` roles.
- **Task Management**: CRUD operations on Tasks.
- **RESTful Design**: Best practices for API endpoints and HTTP methods.
- **Automated Docs**: Swagger UI available out-of-the-box via FastAPI.
- **Modern Frontend**: React + Tailwind CSS with protected routing.

## Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB instance (running locally or remote)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # Windows
   # source venv/bin/activate # Unix
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` in the root folder and configure it:
   ```bash
   MONGO_URI=mongodb://localhost:27017/backend_assessment
   JWT_SECRET=your_jwt_secret
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   > The API will run at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   > The app will run on `http://localhost:5173`.

## Testing the API

To explore the API visually without the frontend, navigate to `http://localhost:8000/docs`. You can register a user, copy the token, click the "Authorize" button at the top, and test protected endpoints like `POST /api/v1/tasks`.
