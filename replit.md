# Mortgage CRM - Replit Project

## Project Overview

This is a full-stack mortgage and loan CRM (Customer Relationship Management) application built for mortgage agents to track clients, applications, tasks, and documents. The application provides a comprehensive dashboard, client management, application tracking with Kanban boards, task management, and document tracking.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: iron-session with password-based login
- **Drag & Drop**: @dnd-kit library

## Recent Changes

- **2024-11-14**: Initial project setup
  - Created Next.js application with TypeScript and Tailwind CSS
  - Set up Prisma with SQLite database
  - Implemented authentication system with session management
  - Built complete dashboard with stats and widgets
  - Created client, application, task, and settings pages
  - Added responsive sidebar navigation
  - Seeded database with sample data

## Project Architecture

### Database Models (Prisma)

1. **Client**: Stores client information (name, email, phone, tags, referral source, notes)
2. **Application**: Tracks mortgage/loan applications with detailed property and financial data
3. **Task**: Manages tasks linked to clients and applications
4. **DocumentRecord**: Tracks document status for each application

### Key Features

- **Dashboard**: Displays application statistics, upcoming closings, and overdue tasks
- **Clients**: Full CRUD operations with search and filtering
- **Applications**: Table and Kanban views with drag-and-drop functionality
- **Tasks**: Task management with priorities, categories, and due dates
- **Documents**: Document tracking per application
- **Settings**: View configuration constants

### Authentication Flow

1. User visits protected route → redirected to /login if not authenticated
2. User enters password → verified against ADMIN_PASSWORD env variable
3. On success → iron-session stores authentication state in encrypted cookie
4. AuthGuard component protects all dashboard routes

### File Structure

- `app/`: Next.js App Router pages and layouts
  - `(dashboard)/`: Protected dashboard routes (clients, applications, tasks, settings)
  - `api/auth/`: Authentication API endpoints
  - `login/`: Login page
- `components/`: Reusable React components (AuthGuard, Sidebar, DashboardLayout)
- `lib/`: Utility functions and configurations (Prisma client, session config, auth helpers)
- `prisma/`: Database schema and seed script

## Environment Setup

Required environment variables in `.env.local`:
- `ADMIN_PASSWORD`: Password for application login
- `SESSION_SECRET`: 32+ character secret for encrypting session cookies

## Development Commands

- `npm run dev`: Start development server on port 5000
- `npx prisma studio`: Open Prisma Studio to view/edit database
- `npx prisma migrate dev`: Create and apply new migration
- `npx prisma db seed`: Seed database with sample data
- `npx prisma generate`: Generate Prisma Client

## Deployment Notes

- Database: SQLite (prisma/dev.db) - stores all application data
- Server: Configured to run on 0.0.0.0:5000 for Replit compatibility
- Build command: `npm run build` (includes Prisma generate)
- Start command: `npm start`

## User Preferences

None recorded yet.
