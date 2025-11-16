# Mortgage CRM - Replit Project

## Overview
This project is a full-stack mortgage and loan CRM application designed for mortgage agents. Its primary purpose is to help agents track clients, loan applications, tasks, and documents efficiently. The application features a comprehensive dashboard, robust client management, application tracking with a Kanban-style interface, detailed task management, and document tracking. The business vision is to streamline the mortgage application process for agents, enhance client relationship management, and improve overall operational efficiency, ultimately increasing agent productivity and client satisfaction.

## User Preferences
None recorded yet.

## System Architecture

### UI/UX Decisions
The application utilizes Next.js 14 with the App Router, React, and TypeScript for the frontend, styled with Tailwind CSS for a modern and responsive user interface. Key UI elements include a comprehensive dashboard with pipeline stage cards, color-coded statistics, and tables for upcoming events and overdue tasks. Application details are presented in a tab-based view (Overview, Tasks, Documents). The GDS/TDS calculator features real-time calculations with color-coded badges and progress bars for clear qualification status visualization.

### Technical Implementations
- **Frontend**: Next.js 14 (App Router), React, TypeScript for a performant and scalable user interface.
- **Styling**: Tailwind CSS for utility-first styling.
- **Backend**: Next.js API Routes for RESTful API endpoints.
- **Database**: SQLite with Prisma ORM for data management. All model IDs use `cuid()` for better scalability.
- **Authentication**: `iron-session` with password-based authentication for secure access.
- **Drag & Drop**: `@dnd-kit` library for interactive elements.

### Feature Specifications
- **Dashboard**: Six-stage pipeline overview (Lead, App Taken/Background, Submitted, Approval, Funded, Declined), funded volume/count, upcoming closings, overdue tasks, and upcoming renewals.
- **Client Management**: Full CRUD operations with search and filtering.
- **Application Tracking**: Comprehensive pipeline tracking with stages, filters (stage, deal type), and sorting. Lender information is stored as a text field.
- **GDS/TDS Qualification Calculator**:
    - Standalone page with optional application linking for pre-filling data.
    - Input sections for income, property expenses, and debt obligations.
    - Real-time GDS/TDS calculations based on industry standards (e.g., 50% condo fee adjustment).
    - Customizable max GDS/TDS limits.
    - Ability to save qualification results back to the linked application.
- **Document Management**: Track documents per application, including category, required status, received status, condition groups, and dates.
- **Communication Log**: Record client interactions with type, direction, subject, notes, and date.
- **Commission Tracking**: Monitor commissions per application, including type, amount, percentage, expected/received dates, and reconciliation status.
- **Task Management**: Calendar-based interface with priorities, categories, due dates, and support for recurring tasks.
- **Bank Account Management**: Track client bank accounts with filtering, search, and pagination.

### System Design Choices
- **Database Models (Prisma)**:
    - **Client**: Core client details.
    - **Application**: Central model for loan tracking, linking to client, qualification, documents, communications, and commissions. Includes pipeline stages and key dates.
    - **Qualification**: Stores detailed GDS/TDS data for each application, with a one-to-one relationship.
    - **Document**: Manages application-specific documents.
    - **Communication**: Logs client communications.
    - **Commission**: Tracks financial commissions.
    - **Task**: Manages agent tasks.
    - **BankAccount**: Stores client banking information.
- **API Routes**:
    - Dedicated API routes for each major entity (applications, clients, documents, communications, commissions, tasks, accounts, dashboard) supporting CRUD operations, filtering, sorting, and search where applicable.
    - Specific API for `/api/applications/[id]/qualification` for GDS/TDS data.
- **Authentication**: Session-based authentication using `iron-session` with environment variable-configured password.
- **File Structure**: Organized with `app/` for Next.js App Router, `components/` for reusable UI, `lib/` for utilities and configurations, and `prisma/` for database schema and migrations.

## External Dependencies
- **Next.js 14 (App Router)**: Frontend framework.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **SQLite**: Lightweight, file-based database for development and deployment.
- **Prisma ORM**: Database toolkit for interacting with SQLite.
- **iron-session**: Library for handling encrypted, password-based sessions.
- **@dnd-kit**: Drag and drop library for React.