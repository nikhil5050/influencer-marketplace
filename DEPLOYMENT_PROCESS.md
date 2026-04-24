# Project Deployment Process on Vercel

## Project Structure
This is a fullstack application with:
- **Frontend**: Next.js (React) - located in `/client`
- **Backend**: Flask (Python) - located in `/server`
- **Configuration**: vercel.json handles both builds

---

## Step 1: Pre-Deployment Checklist

### 1.1 Environment Variables Setup
Ensure all environment variables are configured in Vercel dashboard:

**Frontend (.env.local or in Vercel):**
```env
NEXT_PUBLIC_API_BASE_URL=https://your-vercel-domain.vercel.app/api
```

**Backend (server/.env in Vercel):**
```env
CLOUDINARY_CLOUD_NAME=dt5dpbdb4
CLOUDINARY_API_KEY=425916216982491
CLOUDINARY_API_SECRET=fEXfiWDQCLPzJ-dH-0Hdx4E5sbg
DATABASE_URL=your_database_url
FLASK_ENV=production
SECRET_KEY=your_secret_key
```

### 1.2 Verify Build Configuration
- ✅ `vercel.json` is configured correctly
- ✅ Next.js build scripts are set in `client/package.json`
- ✅ Flask app is properly structured in `server/app.py`

---

## Step 2: Initial Deployment on Vercel

### 2.1 Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Connect your GitHub account and select the repository
5. Select the project root directory: `.` (root)

### 2.2 Configure Project Settings
In Vercel Project Settings:

**Framework Preset:**
- Select **"Next.js"** or **"Other"**

**Root Directory:**
- Leave as `.` or `/`

**Build Command:**
- Leave default (Vercel auto-detects from vercel.json)

**Output Directory:**
- Leave default

### 2.3 Environment Variables
1. Go to **Settings → Environment Variables**
2. Add all variables from your `.env` files:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - DATABASE_URL (if applicable)
   - SECRET_KEY (for Flask)
3. Select environments: **Production**, **Preview**, **Development**

### 2.4 Deploy
Click **"Deploy"** and monitor the build logs

---

## Step 3: Build & Deploy Process

### 3.1 Vercel Build Steps (Automatic)

**For Next.js Frontend:**
```
1. Install dependencies from client/package.json
2. Run: npm run build
3. Generate .next optimized build
4. Output to: /client/.next
```

**For Flask Backend:**
```
1. Detect Python runtime
2. Install requirements from server/requirements.txt
3. Python app runs as Serverless Function
4. Rewrite API routes via /api/* to server/app.py
```

### 3.2 URL Routing (via vercel.json)
```
/api/* → server/app.py (Flask Backend)
/* → client (Next.js Frontend)
```

---

## Step 4: Continuous Deployment

### 4.1 Automatic Deployments
- **Push to main branch**: Auto-deploys to Production
- **Push to other branches**: Creates Preview URLs
- **Pull Requests**: Auto-generates Preview URLs

### 4.2 Manual Deployment (if needed)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel

# Deploy to production
vercel --prod
```

---

## Step 5: Post-Deployment Verification

### 5.1 Test Frontend
- [ ] Visit `https://your-domain.vercel.app`
- [ ] Check all pages load
- [ ] Verify responsive design
- [ ] Check console for errors

### 5.2 Test Backend APIs
- [ ] Test API endpoints: `https://your-domain.vercel.app/api/your-endpoint`
- [ ] Verify authentication routes
- [ ] Check database connectivity
- [ ] Test file uploads (Cloudinary)

### 5.3 Check Logs
In Vercel Dashboard:
1. Go to **Deployments**
2. Click latest deployment
3. View **Function Logs** and **Build Logs**
4. Check for errors or warnings

---

## Step 6: Common Issues & Solutions

### 6.1 Build Failures

**Issue: Python dependencies not installing**
```
Solution: Check server/requirements.txt for syntax errors
         Ensure all packages are compatible with serverless environment
```

**Issue: Next.js build errors**
```
Solution: Check client/package.json for missing dependencies
         Review client/tsconfig.json for type errors
         Check client/next.config.ts configuration
```

### 6.2 Runtime Issues

**Issue: API requests failing**
```
Solution: Check NEXT_PUBLIC_API_BASE_URL points to correct domain
         Verify environment variables are set in Vercel
         Check CORS configuration in Flask app
```

**Issue: Database connection errors**
```
Solution: Verify DATABASE_URL is set in Vercel Environment Variables
         Check database firewall allows Vercel IP ranges
         Test connection locally first
```

### 6.3 Cold Start Issues
- Flask serverless functions may have cold starts
- Consider using Vercel KV for caching if needed

---

## Step 7: Monitoring & Maintenance

### 7.1 Monitor Deployments
- Check Vercel Dashboard regularly
- Review Function usage and performance
- Monitor error rates in logs

### 7.2 Update Dependencies
```bash
# In client directory
npm update

# In server directory
pip list --outdated
```

### 7.3 Performance Optimization
- **Frontend**: Use Next.js Image Optimization
- **Backend**: Optimize Flask queries, add caching
- Monitor bundle size: `npm run build -- --analyze`

---

## Step 8: Rollback Process

If deployment causes issues:

### 8.1 Automatic Rollback
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click **"..." → "Promote to Production"**

### 8.2 Manual Fix & Redeploy
1. Fix issue in code
2. Push to main branch
3. New deployment automatically triggers

---

## Important Notes

⚠️ **Python Packages:** 
- Serverless functions have size limits (~250MB)
- Keep server/requirements.txt minimal

⚠️ **Database:**
- Use environment variables for credentials
- Never commit sensitive data

⚠️ **File Uploads:**
- Use Cloudinary or similar service (you're already using it)
- Don't store uploads on Vercel filesystem

⚠️ **Cold Starts:**
- Flask functions may take 5-10s on first call
- Consider keeping functions warm for critical endpoints

---

## Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Support](https://vercel.com/docs/functions/serverless-functions/python)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/cli)

---

## Deployment Checklist Template

```
PRE-DEPLOYMENT:
☐ All environment variables set in Vercel
☐ No console errors in local dev
☐ All tests passing
☐ vercel.json is correct
☐ No hardcoded API URLs

POST-DEPLOYMENT:
☐ Frontend loads successfully
☐ API endpoints responding
☐ Database connections working
☐ File uploads functioning
☐ No 500 errors in logs
☐ Performance acceptable
```
