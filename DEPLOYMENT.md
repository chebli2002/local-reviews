# Deployment Guide

## Backend Deployment on Render

### Prerequisites
1. MongoDB Atlas account and cluster
2. GitHub repository connected

### Steps

1. **Go to Render Dashboard** → New → Web Service
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `local-reviews-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `pnpm install` (or `npm install`)
   - **Start Command**: `node server.js`

4. **Set Environment Variables in Render:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localreviews?retryWrites=true&w=majority
   JWT_SECRET=your_very_long_random_secret_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

5. **After deployment**, copy your Render URL (e.g., `https://local-reviews-backend.onrender.com`)

---

## Frontend Deployment on Vercel

### Steps

1. **Go to Vercel Dashboard** → Add New Project
2. **Import your GitHub repository**
3. **Configure:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `.` (root)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Set Environment Variables in Vercel:**
   ```
   VITE_API_BASE_URL=https://your-backend-name.onrender.com
   ```
   (Replace with your actual Render backend URL)

5. **Deploy**

---

## MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user (username/password)
4. **Network Access**: Add IP `0.0.0.0/0` (allows all IPs) or Render's IP ranges
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Use as `MONGO_URI` in Render

---

## Environment Variables Reference

### Backend (Render)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localreviews?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
PORT=10000
```

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

---

## Testing Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com/`
   - Should return: `{"message":"API is running..."}`

2. **Test Frontend**: Visit your Vercel URL
   - Try logging in/registering
   - Check browser console for errors

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check browser console for exact error message

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGO_URI` format in Render (no spaces, correct password)

### Build Failures
- Check Render/Vercel logs for specific errors
- Ensure all dependencies are in `package.json`

### Environment Variables Not Working
- Rebuild after adding env vars
- In Vercel, ensure variables start with `VITE_` prefix

