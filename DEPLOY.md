# 2048 Shared Ranking Deployment Guide

This project is ready to deploy as a single Node web service.

## 1) Put project on GitHub

1. Create a new GitHub repository.
2. Upload these files:
   - `index.html`
   - `server.js`
   - `package.json`
   - `rankings.json`

## 2) Deploy on Render (easy)

1. Open [https://render.com](https://render.com) and sign in.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repo and select this project.
4. Use these settings:
   - **Runtime**: Node
   - **Build Command**: *(leave empty)*
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or any)
5. Click **Create Web Service**.
6. Wait for deploy, then open your Render URL.

## 3) Verify shared ranking

1. Open deployed URL in browser A and finish one game.
2. Open the same URL in browser B (or another device).
3. Confirm same ranking is shown.

## Important note (data persistence)

This app currently stores ranking in `rankings.json` file.
On many free cloud instances, file data can reset on restart/redeploy.

If you need stable long-term ranking, move ranking storage to a DB
(Supabase/Postgres/Redis). The current implementation is good for quick shared use.
