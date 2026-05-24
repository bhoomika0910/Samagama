# Samagama Student Help Portal

A MERN-stack student help portal with cookie-based JWT auth, FAQ search, a keyword chatbot, escalation tracking, and an admin panel.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT in httpOnly cookies + bcrypt
- Notifications: react-hot-toast

## Run locally

1. Copy `.env.example` to `.env` in the repo root and fill in your MongoDB, JWT, and email values.
2. Install dependencies from the repo root.
3. Start both apps with the root dev script.

```bash
npm install
npm run dev
```

If you want to start them separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

The client runs on `http://localhost:5173` and the server runs on `http://localhost:5000`.

## Git push flow

Use this when you want to add a new commit and push it to GitHub:

```bash
git add .
git commit -m "Your human commit message"
git push
```

## Notes

- The backend exposes cookie-based auth endpoints, FAQ CRUD, chatbot search, escalations, and admin routes.
- The frontend is routed for login/register, home/FAQ, escalations, and admin views.
- Git is ready in this folder so you can make commits and push to GitHub once you add a remote.