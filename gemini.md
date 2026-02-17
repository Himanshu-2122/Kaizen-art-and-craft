# Gemini Codebase Architecture Report

## Overview

This document outlines the architecture of the Kaizen Art and Craft e-commerce platform. It is a full-stack web application built with a modern JavaScript-based technology stack. The project is structured as a monorepo with separate `frontend` and `backend` directories.

The application is deployed on Vercel, as indicated by the presence of a `vercel.json` file, which is configured for a single-page application (SPA).

## Backend Architecture

The backend is a Node.js application built with the Express framework and written in TypeScript. It serves a RESTful API to the frontend.

### Tech Stack

| Category         | Technology                               |
| ---------------- | ---------------------------------------- |
| **Runtime**      | Node.js                                  |
| **Framework**    | Express                                  |
| **Language**     | TypeScript                               |
| **Database ORM** | Mongoose (for MongoDB), Prisma (detected but no schema found) |
| **Authentication**| JWT (JSON Web Tokens)                    |
| **File Uploads** | Multer                                   |
| **Other**        | bcrypt, cors, dotenv, nodemailer, razorpay, slugify |

### Project Structure

The backend code is organized into the following directories:

-   `src/`: The main source code directory.
    -   `controllers/`: Contains the business logic for handling requests.
    -   `db/`: Database connection logic.
    -   `middleware/`: Express middleware for authentication, rate limiting, and file uploads.
    -   `models/`: Mongoose data models for MongoDB.
    -   `routes/`: Express route definitions.
    -   `seed/`: Database seeding scripts.
    -   `type/`: TypeScript type definitions.
    -   `utils/`: Utility functions.
-   `prisma/`: Contains Prisma-related files, although no `schema.prisma` was found.
-   `uploads/`: Directory for uploaded files.

### API Routes

The backend exposes several RESTful API endpoints, including:

-   `/api/v1/products`
-   `/api/v1/categories`
-   `/api/v1/user`
-   `/api/v1/orders`
-   `/api/v1/contact`
-   `/api/v1/wishlist`
-   `/api/v1/otp`

## Frontend Architecture

The frontend is a single-page application (SPA) built with React and written in TypeScript. It uses Vite for the build tooling.

### Tech Stack

| Category             | Technology                               |
| -------------------- | ---------------------------------------- |
| **Framework**        | React                                    |
| **Language**         | TypeScript                               |
| **Build Tool**       | Vite                                     |
| **Styling**          | Tailwind CSS, shadcn/ui                    |
| **Routing**          | React Router DOM v6                        |
| **State Management** | React Context (AuthProvider, CartProvider, WishlistProvider), TanStack React Query |
| **API Client**       | Axios                                    |
| **UI Components**    | shadcn/ui, Radix UI, Lucide icons          |
| **Testing**          | Vitest, React Testing Library            |

### Project Structure

The frontend code is organized into the following directories:

-   `src/`: The main source code directory.
    -   `components/`: Reusable UI components.
        -   `layout/`: Components that define the overall page structure.
        -   `ui/`: shadcn/ui components.
    -   `contexts/`: React context providers for global state management.
    -   `hooks/`: Custom React hooks.
    -   `integrations/`: Supabase client integration.
    -   `lib/`: Utility functions and the Axios API client.
    -   `pages/`: Components that represent entire pages and are mapped to routes.
        -   `admin/`: Components for the admin dashboard.
    -   `styles/`: Global CSS styles.
    -   `test/`: Test files.

### Routing

The application uses `react-router-dom` for routing. The main routes are defined in `src/App.tsx` and include:

-   `/`: Home page
-   `/shop`: Shop page
-   `/collections`: Collections page
-   `/collections/:slug`: Filtered collections page
-   `/product/:slug`: Product detail page
-   `/about`: About page
-   `/contact`: Contact page
-   `/cart`: Cart page
-   `/wishlist`: Wishlist page
-   `/auth`: Authentication page
-   `/profile`: User profile page
-   `/admin`: Admin dashboard (with nested routes for products, orders, and users)

## Architectural Inconsistencies

There appears to be a mix of database tools in the backend. The `architecture.md` file and the presence of Mongoose models suggest that MongoDB is the primary database. However, the `package.json` also includes `prisma`, but a `prisma/schema.prisma` file is missing, which is unusual for a project using Prisma. This might indicate an incomplete migration or a remnant of a previous implementation.
