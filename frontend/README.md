
# Friends of the Youth (FOTY) Web Application

This repository contains the full-stack code for the Friends of the Youth (FOTY) web application, a platform for a youth empowerment NGO. It includes a public-facing site for information and donations, and a member/admin dashboard with dynamic features.

## Features

- **User Authentication**: Secure registration and login with email/password and Google OAuth2.
- **Password Management**: Full "Forgot Password" and "Reset Password" flow.
- **User Dashboard**: Members can view their achievements, update their profile, and download a membership certificate.
- **Admin Panel**: Admins can manage users and view site activity like donations and volunteer logs.
- **AI-Powered Content**: Gemini API integration to generate community posts and admin announcements.
- **Donation System**: Integration with Stripe (for cards) and a simulated M-Pesa STK push for donations.
- **Community Engagement**: A forum for members to post messages and earn achievement badges.
- **Dynamic Content**: Pages for News, Events, Team, and more, with detailed views.

---

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite (for local development)
  - React Router
  - Axios
  - `@google/genai` for Gemini API

- **Backend**:
  - Node.js
  - Express.js
  - JSON Web Tokens (JWT) for authentication
  - Passport.js with `passport-google-oauth20` for Google Auth
  - Bcrypt.js for password hashing
  - Stripe API for payments
  - Nodemailer for sending password reset emails
  - JSPDF for generating PDF certificates
  - Multer for handling file uploads

---

## Local Development Setup

Follow these steps to run the entire application on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A code editor (e.g., VS Code)

### 1. Backend Setup

The backend server handles all API requests, authentication, and business logic.

**a. Navigate to the `backend` directory:**
```bash
cd backend
```

**b. Install backend dependencies:**
```bash
npm install
```

**c. Create an environment file:**

Create a `.env` file in the `backend` directory by copying the example file:
```bash
cp .env.example .env
```

Now, open `backend/.env` and fill in the required values. These are essential for the application to function correctly.

```env
# Server Configuration
PORT=5000
JWT_SECRET=your_very_secret_jwt_key_here

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe API Keys (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Nodemailer Configuration (for password reset emails)
# Use a service like Gmail, SendGrid, etc.
# For Gmail, you may need an "App Password".
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for redirects and links)
CLIENT_URL=http://localhost:3000
```

**d. Start the backend server:**
```bash
npm start
```
The server will start on `http://localhost:5000` (or the port you specified in `.env`).

---

### 2. Frontend Setup

The frontend is a React single-page application built with Vite.

**a. Install frontend dependencies (from the root directory):**
```bash
npm install
```

**b. Create an environment file:**
Create a `.env` file in the root directory and add your Stripe and Google Client ID keys.
```bash
cp .env.example .env
```
Open the `.env` file and add the keys. **Note:** Vite requires environment variables exposed to the client to be prefixed with `VITE_`.

```env
# Stripe Publishable Key (must match backend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Client ID (for frontend SDK)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**c. Start the frontend development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`. The `vite.config.ts` file is configured to proxy any API requests (`/api/...`) to your backend server running on port 5000, avoiding any CORS issues during development.

You can now access the application at **http://localhost:3000** and use all its features.
