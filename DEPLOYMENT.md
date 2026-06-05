# GITAMate Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon, Supabase, or Railway recommended)
- Google Cloud Console project
- Vercel account

## 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="https://your-domain.vercel.app"
GOOGLE_CLIENT_ID="from Google Cloud Console"
GOOGLE_CLIENT_SECRET="from Google Cloud Console"
```

## 2. Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API" and "OAuth 2.0"
4. Create OAuth 2.0 credentials:
   - Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`
   - Also add `http://localhost:3000/api/auth/callback/google` for local dev
5. Copy Client ID and Client Secret to `.env.local`

## 3. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed admin user - update email below
npx prisma studio  # Use GUI to set isAdmin=true for your account
```

## 4. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

Or connect GitHub repo to Vercel for automatic deployments.

## 6. Make Yourself Admin

After first login:
```sql
UPDATE users SET "isAdmin" = true WHERE email = 'your@gitam.edu';
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## 7. Post-Deployment Checklist

- [ ] Test Google OAuth login with @gitam.edu email
- [ ] Verify non-gitam.edu emails are rejected
- [ ] Complete onboarding flow
- [ ] Test swipe/like feature
- [ ] Test chat between matched users
- [ ] Test event RSVP
- [ ] Verify admin panel works
- [ ] Check mobile responsiveness
