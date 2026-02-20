# Deploy KodbBank to Vercel

Your app has two parts:
- **Frontend** (React) → deploy on **Vercel**
- **Backend** (Node + Express + MySQL) → deploy on **Railway** or **Render** (Vercel is for frontend/serverless, not long-running servers with MySQL)

Follow these steps in order.

---

## Part 1: Deploy backend first (Railway or Render)

Your API must be online before the frontend, so the app can call it.

### Option A: Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select your repo (e.g. `SimranRT/netbanking`).
3. Set **Root Directory** to `backend` (so only the backend is deployed).
4. In **Variables**, add:
   - `DB_HOST` (Aiven MySQL host)
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET` (long random string)
   - `FRONTEND_URL` = `https://your-app.vercel.app` (you’ll set this after Vercel deploy; you can add it later).
5. Deploy. Copy the public URL (e.g. `https://your-app.up.railway.app`).

### Option B: Render

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New** → **Web Service** → connect repo, set **Root Directory** to `backend`.
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add the same **Environment Variables** as above.
6. Deploy and copy the service URL (e.g. `https://your-app.onrender.com`).

Use this URL as your **backend API URL** (e.g. `https://your-app.onrender.com/api` or `https://your-app.up.railway.app/api`).

---

## Part 2: Deploy frontend to Vercel

1. **Push your code to GitHub**  
   Make sure `netbanking` (or your repo) is on GitHub with the latest code.

2. **Go to Vercel**  
   Open [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).

3. **Import the project**  
   - Click **Add New…** → **Project**.  
   - Import the GitHub repo that contains `netbanking` (e.g. `SimranRT/netbanking`).

4. **Configure the project**  
   - **Root Directory:** click **Edit** and set it to **`frontend`**.  
   - **Framework Preset:** Vite (should be auto-detected).  
   - **Build Command:** `npm run build` (default).  
   - **Output Directory:** `dist` (default).  
   - **Install Command:** `npm install` (default).

5. **Environment variable**  
   - Name: `VITE_API_URL`  
   - Value: your backend API base URL, e.g.  
     - Railway: `https://your-app.up.railway.app/api`  
     - Render: `https://your-app.onrender.com/api`  
   - (No trailing slash.)

6. **Deploy**  
   Click **Deploy**. Wait until the build finishes.

7. **Get your frontend URL**  
   After deploy you’ll get a URL like `https://your-project.vercel.app`.  
   - If you used Railway/Render, go back there and set **FRONTEND_URL** to this URL (e.g. `https://your-project.vercel.app`) so the backend allows CORS from your Vercel app.

---

## Part 3: Check everything

1. Open `https://your-project.vercel.app` (your Vercel URL).
2. Try **Register** and **Login**.
3. If you see “Cannot reach server” or CORS errors, confirm:
   - `VITE_API_URL` on Vercel points to the correct backend URL (with `/api` if your backend serves API under `/api`).
   - Backend `FRONTEND_URL` is set to your Vercel URL (no trailing slash).

---

## Summary

| Step | What to do |
|------|------------|
| 1 | Deploy **backend** on Railway or Render; add env vars (DB + JWT + later FRONTEND_URL). |
| 2 | Copy backend URL (e.g. `https://xxx.onrender.com` or `https://xxx.up.railway.app`). |
| 3 | On Vercel, import repo, set **Root Directory** to `frontend`. |
| 4 | Add env var `VITE_API_URL` = backend URL + `/api` (e.g. `https://xxx.onrender.com/api`). |
| 5 | Deploy on Vercel. |
| 6 | Set backend `FRONTEND_URL` to your Vercel URL. |
| 7 | Test Register / Login on the Vercel site. |

Your Aiven MySQL stays as-is; only the backend host (Railway/Render) connects to it using the same `DB_*` variables.
