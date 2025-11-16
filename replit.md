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

- **2024-11-16**: Major Backend Overhaul - Full Mortgage Pipeline System
  - **Database Schema Transformation**:
    - Changed all IDs from Int autoincrement to String cuid() for better scalability
    - Added 5 new models: Lender, Product, Communication, Commission, Document
    - Enhanced Application model with 15+ new fields including stage, dealType, qualification ratios (GDS/TDS), renewal tracking
    - Renamed DocumentRecord to Document with enhanced fields (required, received, conditionGroup, conditionStatus)
    - Added proper cascade deletes (onDelete: Cascade) and SetNull for optional foreign keys
    - Updated Client model with type and primaryContact fields
    - Enhanced Task model with createdForStage field
  
  - **New API Routes** (all with filtering, search, and full CRUD):
    - `/api/lenders`: Lender management with product/application counts
    - `/api/products`: Product management with lender filtering and rate type filtering
    - `/api/documents`: Document tracking with application/condition group/received status filtering
    - `/api/communications`: Client communication tracking with type/client/application filtering
    - `/api/commissions`: Commission tracking with reconciled status filtering
  
  - **Enhanced Existing APIs**:
    - Applications API: Added filters (stage, lender, dealType), sorting (with validation), search; includes lender and product in responses
    - Dashboard API: New pipeline statistics (6 stages), fundedThisMonth aggregate, upcomingRenewals section
    - Clients API: Enhanced to include applications, bank accounts, tasks, communications; simplified delete using cascade
    - Tasks API: Updated to String IDs, enhanced includes
  
  - **Pipeline Stages**: Lead → App Taken/Background → Submitted → Approval → Funded (or Declined)
  
  - **Comprehensive Seed Data**: 5 lenders, 6 products, 6 clients, 6 applications (across all stages), 5 bank accounts, 6 documents, 6 tasks, 5 communications, 3 commissions
  
  - **Updated Dashboard UI**: 
    - 6 pipeline stage cards with color-coded stats
    - Funded This Month card showing total volume and count
    - Upcoming Closings table (next 14 days)
    - Overdue Tasks table
    - Upcoming Renewals table (next 12 months)
  
  - **Updated Navigation**: Added Lenders and Products to sidebar

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

All models now use String IDs (cuid) instead of autoincrement Int for better scalability.

1. **Client**: Stores client information (name, email, phone, type, primaryContact, tags, referral source, notes)
2. **Application**: Comprehensive mortgage/loan tracking with:
   - Pipeline stages: Lead, App Taken/Background, Submitted, Approval, Funded, Declined
   - Property details: address, city, province, postal code, purchase price, down payment
   - Mortgage details: amount, term years, rate type, interest rate
   - Deal type: Purchase, Refinance, Renewal, Switch
   - Lender and Product relationships (optional with SetNull)
   - Qualification fields: GDS ratio, TDS ratio, max qualification amount
   - Important dates: application, submission, approval, closing, renewal
   - Relations: client (required), lender, product, documents, tasks, communications, commissions
3. **Lender**: Financial institutions (name, type, contact info, active status)
4. **Product**: Mortgage products linked to lenders (name, rate type, minimum rate, features, restrictions)
5. **Document**: Application document tracking (name, category, required, received, receivedDate, conditionGroup, conditionStatus)
6. **Communication**: Client communication log (type, direction, subject, notes, communicationDate)
7. **Commission**: Commission tracking per application (type, amount, percentage, expectedDate, receivedDate, reconciled status)
8. **Task**: Task management (title, description, status, priority, category, dueDate, createdForStage)
9. **BankAccount**: Client bank account information (bank name, account nickname, masked account number, account type, owner name, main user, usage, opened date, status, currency, notes)

### Key Features

- **Dashboard**: 
  - 6-stage pipeline overview (Leads, App Taken, Submitted, Approval, Funded, Declined)
  - Funded This Month total volume and count
  - Upcoming Closings (next 14 days)
  - Overdue Tasks
  - Upcoming Renewals (next 12 months)
- **Clients**: Full CRUD operations with search and filtering
- **Applications**: 
  - Complete mortgage pipeline tracking
  - Filters: stage, lender, deal type, search
  - Sorting: by createdAt, closingDate, mortgageAmount, stage, applicationDate
  - Includes lender and product details
- **Lenders**: Full CRUD with product and application counts
- **Products**: Full CRUD with lender filtering and rate type filtering
- **Documents**: Document tracking per application with condition groups and received status
- **Communications**: Client communication log with type and date filtering
- **Commissions**: Commission tracking with reconciled status
- **Tasks**: Task management with priorities, categories, due dates, and pipeline stage tracking
- **Accounts**: Bank account management with client/status/bank filtering, search, and pagination
- **Settings**: View configuration constants

### Authentication Flow

1. User visits protected route → redirected to /login if not authenticated
2. User enters password → verified against ADMIN_PASSWORD env variable
3. On success → iron-session stores authentication state in encrypted cookie
4. AuthGuard component protects all dashboard routes

### File Structure

- `app/`: Next.js App Router pages and layouts
  - `(dashboard)/`: Protected dashboard routes (page.tsx = dashboard, clients, applications, lenders, products, tasks, accounts, settings)
  - `api/auth/`: Authentication API endpoints (login, logout, check)
  - `api/applications/`: Application CRUD with enhanced filtering and sorting
  - `api/clients/`: Client CRUD with enhanced includes
  - `api/lenders/`: Lender CRUD API endpoints
  - `api/products/`: Product CRUD API endpoints
  - `api/documents/`: Document CRUD API endpoints
  - `api/communications/`: Communication CRUD API endpoints
  - `api/commissions/`: Commission CRUD API endpoints
  - `api/tasks/`: Task CRUD API endpoints
  - `api/accounts/`: Bank account CRUD API endpoints
  - `api/dashboard/`: Dashboard statistics and summaries
  - `login/`: Login page
- `components/`: Reusable React components (AuthGuard, Sidebar, DashboardLayout, BankAccountModal)
- `lib/`: Utility functions and configurations (Prisma client, session config, auth helpers)
- `prisma/`: Database schema, migrations, and comprehensive seed script

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
