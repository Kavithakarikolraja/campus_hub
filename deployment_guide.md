# Deployment Guide for Campus Hub

Your codebase has been fully prepared for deployment to Render (Backend) and Vercel (Frontend). The hardcoded `localhost:5000` values have been removed and dynamically connected to environment variables. Follow these steps to complete your deployments.

## 1. Deploy the Backend to Render

1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository. (You may need to split backend and frontend into separate repos, or point Render specifically to the `backend` Root Directory.)
4. Configure the following settings:
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` *(This was added to your package.json!)*
5. Scroll down to **Environment Variables** and add:
   - `MONGO_URI`: `your_mongodb_atlas_connection_string` (Required!)
   - `JWT_SECRET`: `your_jwt_secret_here`
   - `PORT`: `5000` (Render will override this, but it’s good to have)
   - `FRONTEND_URL`: The URL Vercel gives you later (e.g., `https://your-frontend-app.vercel.app`). *This ensures your Socket.io accepts realtime connections from your site.*
6. Click **Create Web Service**. Wait for it to build and deploy. Once complete, copy the unique `.onrender.com` URL (e.g., `https://campus-hub-backend.onrender.com`).

---

## 2. Deploy the Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and create an account.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure the following:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
5. Open the **Environment Variables** section and add:
   - Key: `VITE_API_URL`
   - Value: `https://campus-hub-backend.onrender.com` *(Paste the Render backend URL you copied previously. Make sure there is **no** trailing slash `/` at the end!)*
6. Click **Deploy**. Vercel will build your React Vite app.

### Important Notes
- The frontend will now automatically use the value from `VITE_API_URL` when connecting to the database through Axios and Socket.io.
- When running locally, if the `VITE_API_URL` is completely missing, the app will safely fallback to `http://localhost:5000`.
- MongoDB Atlas MUST have the IP `0.0.0.0/0` whitelisted to allow your Render backend to connect.
