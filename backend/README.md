# **Friends of the Youth (FOTY) \- Backend**

Welcome to the official backend repository for the Friends of the Youth (FOTY) web application. This server is built with Node.js, Express, PostgreSQL, and Prisma ORM to provide a secure, scalable, and robust API for our frontend.

## **Table of Contents**

1. [Features](#bookmark=id.pc9d09jcy4zh)  
2. [Tech Stack](#bookmark=id.kkeqze95gz0b)  
3. [Required APIs & Keys](#bookmark=id.502dbjadbq0d)  
4. [Local Development Setup](#bookmark=id.smbnooj2alaq)  
5. [Running the Backend](#bookmark=id.qtn1zygz2u5f)  
6. [Connecting to the Frontend](#bookmark=id.c1vya34ns5r5)  
7. [Project Structure](#bookmark=id.odfrm1armzqh)  
8. [Full API Endpoint List](#bookmark=id.fp54cehsxazy)

## **Features**

* **Authentication:** Secure JWT (access token) login, password hashing (bcrypt), and admin role management.  
* **Social Logins:** Full OAuth 2.0 integration for Google.  
* **Donations:** M-Pesa Daraja API integration for STK push payments and callback handling.  
* **Membership:** User registration, profiles, and PDF certificate generation (jsPDF).  
* **Engagement:** Bulletin board (create/read posts), event management (create/read/RSVP), and user badges.  
* **Automation:** Cron jobs (node-cron) for daily and weekly email newsletters (Nodemailer).  
* **Admin Panel:** Google Sheets integration for syncing user, donation, and event data.  
* **Database:** Seeding script for default admin, badges, and sample content.

## **Tech Stack**

* **Runtime:** Node.js  
* **Framework:** Express.js  
* **Database:** PostgreSQL  
* **ORM:** Prisma  
* **Authentication:** JWT (JSON Web Tokens), passport.js for Google OAuth  
* **Payments:** axios for M-Pesa Daraja API  
* **Emails:** Nodemailer (with node-cron for scheduling)  
* **PDFs:** jsPDF & jspdf-autotable  
* **Admin:** googleapis for Google Sheets API

## **Required APIs & Keys (Action Needed)**

To run this backend, you must get API keys from 6 external services. Use the backend/.env.example file as a template:

1. Copy .env.example to a new file named .env.  
2. Fill in all the variables below.

| Service | .env Variable(s) | Where to Get It |
| :---- | :---- | :---- |
| **Your Server** | PORT | Set to 5000 (or any port you prefer). |
|  | JWT\_SECRET | A long, random string you create (e.g., from a password generator). |
|  | CLIENT\_URL | Your frontend's URL (e.g., http://localhost:5173). |
| **PostgreSQL DB** | DATABASE\_URL | From **Railway**, **Render**, or **Supabase**. (See section 4.1). |
| **Email (SMTP)** | EMAIL\_HOST, EMAIL\_PORT, EMAIL\_USER, EMAIL\_PASS | From an SMTP provider like **SendGrid**, **Brevo**, or **Mailtrap**. |
| **Google OAuth** | GOOGLE\_CLIENT\_ID, GOOGLE\_CLIENT\_SECRET, GOOGLE\_CALLBACK\_URL | From [Google Cloud Console](https://console.cloud.google.com/). Create "OAuth 2.0 Client ID". **Must add your callback URL to "Authorized redirect URIs"** (e.g., http://localhost:5000/api/v1/auth/google/callback). |
| **Google Sheets** | GOOGLE\_SERVICE\_ACCOUNT\_EMAIL, GOOGLE\_PRIVATE\_KEY, GOOGLE\_SHEET\_ID | From [Google Cloud Console](https://console.cloud.google.com/). Create a "Service Account", enable Sheets API, and download the JSON key. **Must share your Google Sheet with the client\_email**. |
| **M-Pesa** | MPESA\_CONSUMER\_KEY, MPESA\_CONSUMER\_SECRET, MPESA\_SHORTCODE, MPESA\_PASSKEY, MPESA\_CALLBACK\_URL | From [Safaricom Daraja Portal](https://developer.safaricom.co.ke/). Use Sandbox credentials. You'll need a public URL (like **ngrok**) for the callback. |

## **Local Development Setup**

Follow these steps exactly to get your database and project running.

### **Step 1: Install Dependencies**

\# Navigate to your backend folder  
cd foty-backend

\# Install all packages from package.json  
npm install

### **Step 2: Set Up Your PostgreSQL Database**

You have two main options. **Option A is highly recommended.**

#### **Option A: Use a Free Cloud Database (Recommended)**

1. Go to a service like [Railway.app](https://railway.app/) or [Render.com](https://render.com/).  
2. Create a new project and add a "PostgreSQL" database.  
3. The service will provide you with a **DATABASE\_URL** (a connection string).  
4. Copy this URL and paste it into your .env file for the DATABASE\_URL variable.

#### **Option B: Install PostgreSQL Locally (Advanced)**

1. Download and install [PostgreSQL](https://www.postgresql.org/download/) on your computer.  
2. Create a new user and a new database for this project (e.g., foty\_db).  
3. Your DATABASE\_URL in your .env file will look like this: postgresql://YOUR\_USERNAME:YOUR\_PASSWORD@localhost:5432/foty\_db

### **Step 3: Run the Database Migration & Seed**

This is the most important step. This command will:

1. Connect to your database (from your DATABASE\_URL).  
2. Create all the tables defined in prisma/schema.prisma.  
3. Run the prisma/seed.js script to create your admin user, badges, and sample content.

\# Run this from your backend folder  
npm run db:migrate

**After running this, your database is 100% set up and ready.**  
You can optionally run npm run db:studio to open a browser-based UI to see your database tables.

## **Running the Backend**

With your .env file complete and your database migrated, you are ready to start the server.  
\# This starts the server in "development mode"  
\# It will automatically restart when you change a file  
npm run dev

### **How to Verify It's Running**

If the server starts successfully, you will see two messages in your terminal:  
\[Server\] 🚀 Server running on port 5000  
\[Database\] 💾 Connected to database

You can also test it by visiting this URL in your browser: **http://localhost:5000/api/v1/health**  
You should see a JSON response: {"status":"UP","message":"FOTY API is healthy"}

## **Connecting to the Frontend**

Your backend and frontend are two separate servers. To connect them:

1. **Set the Base URL:** In your **React frontend project**, create a .env file.  
2. **Add the Variable:** Add this line, which tells your React app where the backend is.  
   \# (Use VITE\_ or REACT\_APP\_ depending on your setup)  
   VITE\_API\_BASE\_URL=http://localhost:5000/api/v1

3. **Make API Calls:** In your React code (using axios or fetch), make requests to this base URL.

**Example: Login from React**  
import axios from 'axios';  
const API\_URL \= import.meta.env.VITE\_API\_BASE\_URL;

async function loginUser(email, password) {  
  // This sends a request to:  
  // http://localhost:5000/api/v1/auth/login  
  const response \= await axios.post(\`${API\_URL}/auth/login\`, {  
    email,  
    password,  
  });  
    
  // Save the token from the backend  
  localStorage.setItem('foty\_token', response.data.token);  
}

## **Project Structure**

backend/  
├── prisma/  
│   ├── schema.prisma         \# Database models  
│   └── seed.js               \# Seed script (admin, badges)  
│  
├── src/  
│   ├── job/  
│   │   └── newsletter.job.js   \# Automated email cron jobs  
│   │  
│   ├── app.js                  \# Main Express server setup  
│   ├── controllers.js          \# All API logic (the "brains")  
│   ├── database.js             \# Prisma client instance  
│   ├── middleware.js           \# 'protect' (JWT) & 'admin' (role) security  
│   ├── passport.config.js      \# Google Social Login logic  
│   ├── routes.js               \# All API routes defined  
│   └── services.js             \# All 3rd-party services (Email, PDF, Sheets)  
│  
├── .env.example              \# Template for all your secret keys  
├── .env                      \# (Your private keys \- DO NOT COMMIT)  
├── package.json              \# Project dependencies  
└── README.md                 \# This file

## **Full API Endpoint List**

All routes are prefixed with /api/v1.

### **\[PUBLIC\] \= No login required**

### **\[AUTH\] \= Valid JWT (any user) required**

### **\[ADMIN\] \= Admin user required**

### **Auth Routes (/auth)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| POST | /auth/register | \[PUBLIC\] | Register a new user. |
| POST | /auth/login | \[PUBLIC\] | Log in and get a JWT. |
| GET | /auth/google | \[PUBLIC\] | Redirects to Google for login. |
| GET | /auth/google/callback | \[PUBLIC\] | Google redirects here. Logs user in and sends JWT. |

### **User Routes (/users)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| GET | /users/profile | \[AUTH\] | Get the logged-in user's profile. |
| PUT | /users/profile | \[AUTH\] | Update the logged-in user's profile. |
| GET | /users/certificate | \[AUTH\] | Generates and downloads a PDF membership certificate. |
| POST | /users/subscribe | \[AUTH\] | Subscribe to the newsletter. |
| POST | /users/unsubscribe | \[AUTH\] | Unsubscribe from the newsletter. |

### **Donation Routes (/donations)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| POST | /donations/stk-push | \[PUBLIC\] | Initiates an M-Pesa STK push to the user's phone. |
| POST | /donations/callback | \[PUBLIC\] | **Webhook** for M-Pesa to send payment status. |
| GET | /donations | \[AUTH\] | Get a list of the logged-in user's past donations. |

### **Bulletin Board Routes (/posts)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| GET | /posts | \[PUBLIC\] | Get a paginated list of all bulletin posts. |
| GET | /posts/:id | \[PUBLIC\] | Get a single post by its ID. |
| POST | /posts | \[AUTH\] | Create a new post. |
| PUT | /posts/:id | \[AUTH\] | Update your own post. |
| DELETE | /posts/:id | \[AUTH\] | Delete your own post. |

### **Event Routes (/events)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| GET | /events | \[PUBLIC\] | Get a list of all upcoming events. |
| GET | /events/:id | \[PUBLIC\] | Get a single event by its ID. |
| POST | /events/:id/rsvp | \[AUTH\] | RSVP for an event. |
| DELETE | /events/:id/rsvp | \[AUTH\] | Cancel your RSVP for an event. |

### **Admin Routes (/admin)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| GET | /admin/users | \[ADMIN\] | Get a list of all users. |
| GET | /admin/donations | \[ADMIN\] | Get a list of all donations. |
| POST | /admin/events | \[ADMIN\] | Create a new event. |
| PUT | /admin/events/:id | \[ADMIN\] | Update an existing event. |
| DELETE | /admin/events/:id | \[ADMIN\] | Delete an event. |
| POST | /admin/badges | \[ADMIN\] | Create a new badge type. |
| POST | /admin/users/:userId/badge | \[ADMIN\] | Manually award a badge to a user. |
| GET | /admin/sync/users | \[ADMIN\] | Triggers sync of "Users" table to Google Sheets. |
| GET | /admin/sync/donations | \[ADMIN\] | Triggers sync of "Donations" table to Google Sheets. |
| GET | /admin/sync/events | \[ADMIN\] | Triggers sync of "Events" table to Google Sheets. |

### **Other Routes (/)**

| Method | Endpoint | Access | Description |
| :---- | :---- | :---- | :---- |
| GET | /health | \[PUBLIC\] | Health check endpoint. |
| GET | /badges | \[PUBLIC\] | Get a list of all available badge types. |

