# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free)
- Node.js installed locally

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Convert to Vercel serverless functions"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Set the following:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### 3. Environment Variables (Optional)
If you need to override the API URL, add:
- `VITE_API_URL`: Your custom API URL

## Project Structure
```
frontend/
├── api/                 # Serverless functions
│   ├── health.js       # Health check endpoint
│   ├── trains.js       # Train data endpoint
│   ├── platforms.js    # Platform data endpoint
│   └── kpis.js         # KPI calculations endpoint
├── public/
│   └── data/           # CSV data files
│       ├── train_data.csv
│       └── platform_track_data.csv
├── src/                # React frontend
└── vercel.json         # Vercel configuration
```

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/trains` - Train data
- `GET /api/platforms` - Platform data  
- `GET /api/kpis` - KPI metrics

## Notes
- All backend functionality is now serverless functions
- CSV data is served from the public directory
- No separate backend deployment needed
- Automatic scaling and global CDN
