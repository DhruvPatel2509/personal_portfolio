# Dhruv Patel — Full Stack Portfolio (MERN)

A modern, dark-themed, glassmorphic personal portfolio with a fully separate,
JWT-protected admin dashboard. Built with the MERN stack.

## Tech Stack

- **Frontend:** React 18 + Vite, Tailwind CSS, React Router, Axios, Framer Motion, React Icons, react-hot-toast
- **Backend:** Node.js, Express.js, MVC architecture
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt (single admin account)
- **Uploads:** Multer, stored locally under `backend/uploads/`

## Project Structure

```
portfolio/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers (business logic)
│   ├── middleware/      # auth, upload, error handling
│   ├── models/          # Mongoose schemas (11 collections)
│   ├── routes/          # Express routers
│   ├── uploads/          # uploaded images / resume (gitignored)
│   ├── utils/            # helpers + admin seed script
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── api/          # axios instance + service functions
        ├── components/
        │   ├── layout/   # Navbar, Footer
        │   ├── sections/ # Hero, About, Skills, Projects, ... (public site)
        │   ├── project/  # ProjectCard, ProjectModal
        │   ├── admin/    # AdminLayout, ProtectedRoute, FormModal, etc.
        │   └── ui/       # Loader, ScrollProgress, Skeleton, SectionHeading
        ├── context/      # AuthContext (admin session)
        ├── hooks/        # useFetch, useDebounce, useScrollProgress
        ├── pages/        # Home, NotFound, admin/*
        └── App.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, and ADMIN_EMAIL / ADMIN_PASSWORD

npm run seed   # creates the single admin account from .env
npm run dev    # starts the API on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Defaults already point to http://localhost:5000/api — adjust if needed

npm run dev    # starts the site on http://localhost:5173
```

### 3. Log in to the admin dashboard

Visit `http://localhost:5173/admin/login` and sign in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env` before running
`npm run seed`.

## What's Included

**Public site:** Hero (typing animation + particle background), About,
Skills (progress bars by category), Projects (search/filter/pagination +
detail modal), Education & Experience timelines, Certifications,
Achievements, Coding Profiles, Contact form (writes to MongoDB), Footer,
scroll progress bar, loading screen, and a 404 page.

**Admin dashboard:** JWT-protected, single-admin login, sidebar navigation,
stats overview, and full CRUD for About, Skills, Projects (multi-image
upload), Education, Experience, Certificates, Achievements, Coding Profiles,
Resume (PDF replace), Contact Messages (search / mark read / delete), and
Settings (site title, logo, favicon, SEO, theme color, footer text).

**API:** REST endpoints for all 11 collections, following MVC conventions,
with centralized error handling, request validation, and consistent
`{ success, data }` response shapes. See each file in `backend/routes/` for
the exact endpoints.

## Notes & Next Steps

- This is a complete, runnable scaffold — every file has been syntax-checked,
  the frontend has been built and dev-server-tested end-to-end, but the
  backend has **not** been tested against a live MongoDB instance in this
  environment (no DB was available here). Point `MONGO_URI` at a real
  database and it should work as-is; the connection/error-handling logic was
  verified independently.
- Images/resume are stored on local disk under `backend/uploads/` — for a
  production deployment behind multiple server instances, swap this for a
  cloud store (S3, Cloudinary, etc.) by changing `middleware/uploadMiddleware.js`.
- Add real content (photo, bio, projects, resume PDF) via the admin
  dashboard after first login — every public section gracefully shows
  placeholder copy until data exists.
- For production, set `NODE_ENV=production`, a strong `JWT_SECRET`, and
  restrict CORS (`CLIENT_URL`) to your deployed frontend origin.

## Deployment

### Frontend (Vercel)

1. Create a new project in Vercel and point it at the `frontend` folder.
2. If asked, use:
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
3. Add these environment variables in Vercel:
   - `VITE_API_URL=https://<your-render-backend-url>/api`
   - `VITE_UPLOADS_URL=https://<your-render-backend-url>`
4. Deploy and confirm the public site loads.

### Backend (Render)

1. Create a new Web Service in Render and use the `backend` folder as the root.
2. Set:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Add these environment variables in Render:
   - `MONGO_URI` → your MongoDB connection string
   - `JWT_SECRET` → a strong secret string
   - `CLIENT_URL` → your Vercel frontend URL
     - If you need multiple allowed origins, separate them with commas.
     - Example: `https://my-site.vercel.app,https://my-site-git-main.vercel.app`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` → for initial admin seeding
   - Optional: `NODE_ENV=production`, `MAX_FILE_SIZE=5242880`
4. After deploy, run `npm run seed` once with the same environment values to create the admin account.

> Note: `backend/uploads/` is stored locally. On Render, local upload files are ephemeral and may not persist across deploys or restarts. For long-term upload storage, replace local disk storage with a cloud asset store.
