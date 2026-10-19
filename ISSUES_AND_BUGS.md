# Kaizen Art and Craft - ISSUES AND BUGS

## Critical Issues

### 1. Redundant dotenv.config() Calls (`backend/src/app.ts:66`)
- **Location:** `backend/src/app.ts:66` - `const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";`
- **Problem:** `dotenv.config()` is called in `server.ts` (line 103) AND in `app.ts` (line 18, commented as "❌ dotenv yahan mat karo — server.ts mein already hai")
- **Impact:** Redundant environment loading; potential for env variables to be loaded twice or in wrong order
- **Recommendation:** Remove `dotenv.config()` from `app.ts` since `server.ts` already handles it

### 2. Dead/Commented-Out Code in `server.ts` (`backend/src/server.ts`)
- **Location:** `backend/src/server.ts` - Multiple large blocks of commented-out code showing iterative development
- **Problem:** File contains 3+ complete rewrites of the same logic (imports, db connection, server start)
- **Impact:** Code confusion, harder maintenance; future developers may remove "unused" code that's actually needed
- **Recommendation:** Remove all commented-out blocks, keep only the final dynamic import approach (lines 106-122)

### 3. Prisma Dependencies Without Schema (`backend/package.json`)
- **Location:** `backend/package.json` - `prisma` listed at version `^6.19.2`
- **Problem:** Prisma is installed as a dependency but no `prisma.schema` file exists in the repository
- **Impact:** Wasted dependencies, potential version conflicts; CI/CD may attempt Prisma operations that fail
- **Recommendation:** Either remove Prisma from dependencies or add a proper `prisma/schema.prisma` file

### 4. CORS Security Misconfiguration (`backend/src/app.ts:70-83`)
- **Location:** `backend/src/app.ts:73-80`
- **Problem:** Origin check logic: `origin === allowedOrigin || process.env.NODE_ENV !== "production"` allows ALL origins in non-production environments
- **Impact:** In development mode, any origin can make requests to the API (open CORS vulnerability)
- **Recommendation:** Always validate origin, or use a whitelist that applies to all environments

### 5. Type Import from Express in `app.ts` (`backend/src/app.ts:54`)
- **Location:** `backend/src/app.ts:54` - `import express, { Request, Response, NextFunction } from "express";`
- **Problem:** Types are imported but may not align with the Express version being used (^5.2.1)
- **Impact:** Potential TypeScript mismatches, runtime type errors

## Moderate Issues

### 6. Missing Prisma Configuration
- **Problem:** Project has `prisma` in dependencies but no schema file, no `prisma migrate` setup
- **Likelihood:** The db connection in `db/index.ts` uses MongoDB/Mongoose exclusively
- **Recommendation:** Remove Prisma dependency or fully integrate it

### 7. Uploads Directory Structure Not Verified
- **Problem:** `app.ts` serves static files from `../uploads` but no verification that the directory exists or has proper permissions
- **Impact:** 404 errors or file access issues on deployment

### 8. No Global Error Boundary on Frontend
- **Problem:** Frontend has no global error boundary; individual components may crash the UI
- **Impact:** User-facing errors not caught gracefully

### 9. Supabase + Custom Backend Hybrid Confusion
- **Problem:** Project uses both Supabase (for public product listing) and custom backend API (for auth/wishlist/admin)
- **Impact:** Inconsistent data models, potential sync issues between the two data sources

### 10. `auth.routes.ts` likely missing rate limiting
- **Problem:** OTP authentication endpoints are vulnerable to brute force attacks
- **Impact:** Account compromise via OTP flooding

## Minor Issues / Code Quality

### 11. Inconsistent Coding Style in `server.ts`
- **Problem:** Mix of CommonJS (`type: "commonjs"`) and ES module patterns in comments
- **Impact:** Minor, but contributes to code confusion

### 12. Seed file not test-connected
- **Problem:** `seed/seed.ts` exists but has no dedicated test script or CI integration
- **Impact:** Sample data may not be current

### 13. `contact.routes.ts` handler may not validate input thoroughly
- **Problem:** Contact form routes may pass through malformed data
- **Impact:** Database pollution, potential injection risks

---

## Technical Debt

### Planned Refactoring
1. **Clean up `server.ts`** - Remove all commented-out code, standardize on one import/style pattern
2. **Decide on Prisma vs Mongoose** - Remove one to eliminate confusion
3. **Fix CORS middleware** - Apply consistent origin validation across all environments
4. **Add rate limiting to auth routes** - Especially OTP verification endpoints
5. **Add frontend error boundary** - Global error handling for React components
6. **Consolidate dotenv loading** - Single point of truth for environment variable loading

### Known Limitations
- Production deployment will need proper `uploads/` directory setup
- Environment variables must be configured for all 13+ vars across both apps
- No integration tests connecting frontend ↔ backend workflows