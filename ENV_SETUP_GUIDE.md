# Environment Configuration Guide

## Overview

This project requires environment variables for both backend and frontend. This guide explains each variable and how to obtain/generate them.

---

## Backend Configuration

### Setup Steps

1. **Copy template file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Fill in the values** as described below.

### Backend Variables

#### 1. **PORT** (Optional)
- **Default:** `5000`
- **Type:** Number
- **Description:** Express server port
- **Example:** `PORT=5000`

#### 2. **MONGODB_URI** (Required)
- **Type:** String (URI)
- **Description:** MongoDB Atlas connection string
- **How to get:**
  1. Create account at https://www.mongodb.com/cloud/atlas
  2. Create a cluster (free tier available)
  3. Get connection string from "Connect" button
  4. Include database name: `/kaizen`
- **Format:** `mongodb+srv://username:password@cluster.mongodb.net/kaizen?retryWrites=true&w=majority&appName=kaizen`
- **Example:** 
  ```
  MONGODB_URI=mongodb+srv://himanshu21:vXe3x3U6MtGIdMp8@my-start-up.rohyo2f.mongodb.net/kaizen?retryWrites=true&w=majority&appName=my-start-up
  ```

#### 3. **JWT_SECRET** (Required)
- **Type:** String (random secret)
- **Description:** Secret key for signing JWT access tokens (expires in 15 minutes)
- **Minimum Length:** 32 characters (strongly recommended)
- **How to generate:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security:** Keep this secret and never commit to version control
- **Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

#### 4. **JWT_REFRESH_SECRET** (Required)
- **Type:** String (random secret)
- **Description:** Secret key for signing JWT refresh tokens (expires in 7 days)
- **Minimum Length:** 32 characters (strongly recommended)
- **How to generate:** Same as JWT_SECRET (use a different value)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security:** Keep this secret and never commit to version control
- **Example:** `f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1`

#### 5. **GMAIL_USER** (Required for contact form)
- **Type:** Email address
- **Description:** Gmail address for sending emails (contact form submissions)
- **Requirements:** Must have 2FA enabled
- **Example:** `your_email@gmail.com`

#### 6. **GMAIL_APP_PASSWORD** (Required for contact form)
- **Type:** String (16-character app password)
- **Description:** Gmail app-specific password (NOT your regular Gmail password)
- **Why separate:** More secure than using your main password
- **How to generate:**
  1. Go to https://myaccount.google.com
  2. Select "Security" in the left sidebar
  3. Enable 2-Step Verification if not already enabled
  4. Go back to Security and find "App passwords"
  5. Select "Mail" and "Windows Computer"
  6. Google will generate a 16-character password
  7. Copy it without spaces: `abcdefghijklmnop`
- **Example:** `abcd efgh ijkl mnop` → use as `abcdefghijklmnop`

#### 7. **RAZORPAY_KEY_ID** (Optional - Not yet implemented)
- **Type:** String
- **Status:** Package installed but payment integration incomplete
- **How to get:** https://dashboard.razorpay.com/app/keys
- **Leave as:** `your_razorpay_key_id`

#### 8. **RAZORPAY_KEY_SECRET** (Optional - Not yet implemented)
- **Type:** String
- **Status:** Package installed but payment integration incomplete
- **How to get:** https://dashboard.razorpay.com/app/keys
- **Leave as:** `your_razorpay_key_secret`

---

## Frontend Configuration

### Setup Steps

1. **Copy template file:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Fill in the values** as described below.

### Frontend Variables

#### 1. **VITE_API_URL** (Required)
- **Type:** URL
- **Description:** Backend API base URL
- **Development:** `http://localhost:5000/api/v1`
- **Production:** `https://your-domain.com/api/v1`
- **Used for:** All API calls from frontend
- **Example:** `VITE_API_URL=http://localhost:5000/api/v1`

#### 2. **VITE_SUPABASE_URL** (Optional - Legacy)
- **Type:** URL
- **Status:** Currently only used in `useProducts` hook for image storage
- **Description:** Supabase project URL
- **How to get:** https://app.supabase.com/projects
- **Can be:** Placeholder value if not actively using Supabase
- **Example:** `VITE_SUPABASE_URL=https://xyz.supabase.co`

#### 3. **VITE_SUPABASE_PUBLISHABLE_KEY** (Optional - Legacy)
- **Type:** String (API key)
- **Status:** Currently only used in `useProducts` hook for image storage
- **Description:** Supabase anonymous public key (safe to expose)
- **How to get:** https://app.supabase.com/project/_/settings/api
- **Can be:** Placeholder value if not actively using Supabase
- **Example:** `VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...`

---

## Quick Setup Checklist

### For Local Development

- [ ] Backend `.env` created from `.env.example`
- [ ] `PORT=5000` set
- [ ] `MONGODB_URI` pointing to MongoDB Atlas
- [ ] `JWT_SECRET` generated with random 32+ character string
- [ ] `JWT_REFRESH_SECRET` generated with random 32+ character string
- [ ] `GMAIL_USER` and `GMAIL_APP_PASSWORD` configured (or comment out if not testing email)
- [ ] Frontend `.env` created from `.env.example`
- [ ] `VITE_API_URL=http://localhost:5000/api/v1` set
- [ ] Supabase values optional (can use placeholder)

### For Production

- [ ] All required variables filled with production values
- [ ] `.env` file NOT committed to git (use `.gitignore`)
- [ ] Secrets stored securely (use platform secrets/vaults)
- [ ] `VITE_API_URL` points to production backend URL
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are strong random values
- [ ] Database credentials are for production MongoDB
- [ ] Email service configured correctly

---

## Environment Variable Summary Table

| Variable | Backend | Frontend | Required | Status |
|----------|---------|----------|----------|--------|
| PORT | ✅ | - | No | Implemented |
| MONGODB_URI | ✅ | - | Yes | Implemented |
| JWT_SECRET | ✅ | - | Yes | Implemented |
| JWT_REFRESH_SECRET | ✅ | - | Yes | Implemented |
| GMAIL_USER | ✅ | - | For email | Implemented |
| GMAIL_APP_PASSWORD | ✅ | - | For email | Implemented |
| RAZORPAY_KEY_ID | ✅ | - | No | Not implemented |
| RAZORPAY_KEY_SECRET | ✅ | - | No | Not implemented |
| VITE_API_URL | - | ✅ | Yes | Implemented |
| VITE_SUPABASE_URL | - | ✅ | No | Legacy |
| VITE_SUPABASE_PUBLISHABLE_KEY | - | ✅ | No | Legacy |

---

## Troubleshooting

### MongoDB Connection Issues
- Check username/password doesn't have special characters that need URL encoding
- Verify IP whitelist includes your current IP (or use 0.0.0.0 for development)
- Ensure database name is included: `/kaizen`

### JWT Token Issues
- Secrets must be at least 32 characters
- Never use the same value for both secrets
- Regenerate if tokens are not being created properly

### Gmail/Email Issues
- Ensure 2-Factor Authentication is enabled
- Use app-specific password, not regular Gmail password
- Verify email address matches in both GMAIL_USER and Gmail account settings

### API Connection (Frontend)
- Verify backend server is running on PORT 5000
- Check VITE_API_URL matches backend server address
- Clear browser cache and restart dev server if URL changed

---

## Security Best Practices

1. **Never commit `.env` files to git**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Never share secrets**
   - Don't commit `.env` files
   - Don't share JWT secrets
   - Don't expose in error messages or logs

3. **Rotate secrets periodically**
   - Generate new JWT secrets quarterly
   - Update database passwords regularly
   - Refresh Gmail app passwords if compromised

4. **Use strong random values**
   - Minimum 32 characters for secrets
   - Use `crypto.randomBytes()` for generation
   - Avoid predictable patterns

5. **Environment separation**
   - Development, staging, and production should have different credentials
   - Use platform-specific secret management in production
