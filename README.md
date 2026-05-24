# Samagama Student Help Portal

A MERN-stack student help portal with cookie-based JWT auth, FAQ search, a keyword chatbot, escalation tracking, and an admin panel.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT in httpOnly cookies + bcrypt
- Notifications: react-hot-toast

## Run locally

1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies from the repo root.
3. Start both apps with `npm run dev`.

## Notes

- The backend exposes cookie-based auth endpoints, FAQ CRUD, chatbot search, escalations, and admin routes.
- The frontend is routed for login/register, home/FAQ, escalations, and admin views.
- Git is ready in this folder so you can make commits and push to GitHub once you add a remote.