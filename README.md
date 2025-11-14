# Mortgage & Loan CRM Tracker

A full-featured mortgage and loan CRM application built for mortgage agents to track clients, applications, tasks, and documents.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: Simple password-based authentication with iron-session
- **Drag & Drop**: @dnd-kit (for Kanban board)

## Features

### Authentication
- Single-user password authentication
- Session-based login with secure cookies
- Protected routes (automatic redirect to login if not authenticated)

### Dashboard
- Key application statistics (Leads, Submitted, Conditional Approval, Funded)
- Total funded volume for the current month
- Upcoming closings (next 14 days)
- Overdue tasks widget

### Clients Management
- Full CRUD operations (Create, Read, Update, Delete)
- Complete client information tracking
- Search and filter capabilities (by name, email, phone, tags)
- Client detail pages with application history
- Edit notes functionality
- Tag management (Hot Lead, Cold Lead, Active, Closed, etc.)

### Applications Tracking
- Comprehensive application details (property info, financials, dates)
- **Dual View**: Toggle between Table view and Kanban board
- **Drag-and-Drop Kanban**: Move applications between status columns
- Full CRUD operations (Create, Read, Update, Delete)
- Application detail pages with tasks and documents
- Support for multiple loan types (Mortgage, HELOC, Personal, etc.)

### Tasks Management
- Full CRUD operations (Create, Read, Update, Delete)
- Task tracking with due dates, priorities, and categories
- Link tasks to clients and applications
- Filter by status, category, and priority
- Overdue task alerts

### Document Tracking
- Full CRUD operations (Create, Read, Update, Delete)
- Track document status per application
- Multiple document types (Paystub, Tax Return, Bank Statement, etc.)
- Document status tracking (Requested, Received, Verified, Missing)
- Add notes to each document

### Settings
- View all configuration constants
- Application types, purposes, statuses
- Property types, rate types
- Task and document configurations

## Installation

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
ADMIN_PASSWORD=your-secure-password-here
SESSION_SECRET=a-strong-32-character-secret-key-for-encryption
\`\`\`

**Important**: Replace these with your own secure values in production!

### 3. Set Up the Database

Generate Prisma Client:

\`\`\`bash
npx prisma generate
\`\`\`

Run database migrations:

\`\`\`bash
npx prisma migrate dev
\`\`\`

Seed the database with sample data:

\`\`\`bash
npx prisma db seed
\`\`\`

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at [http://localhost:5000](http://localhost:5000)

## Default Login

Use the password you set in your \`.env.local\` file as \`ADMIN_PASSWORD\`.

If you're using the default development setup, the password is: \`mortgage2024!\`

## Database Schema

The application uses four main models:

- **Client**: Store client information, contact details, tags, and referral sources
- **Application**: Track mortgage/loan applications with detailed property and financial information
- **Task**: Manage tasks linked to clients and applications
- **DocumentRecord**: Track document status for each application

## Prisma Commands

### View Database in Prisma Studio

\`\`\`bash
npx prisma studio
\`\`\`

### Reset Database (Warning: Deletes all data!)

\`\`\`bash
npx prisma migrate reset
\`\`\`

### Create a New Migration

\`\`\`bash
npx prisma migrate dev --name your_migration_name
\`\`\`

## Project Structure

\`\`\`
.
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── page.tsx          # Dashboard home
│   │   ├── clients/          # Clients pages
│   │   ├── applications/     # Applications pages
│   │   ├── tasks/            # Tasks pages
│   │   └── settings/         # Settings page
│   ├── api/
│   │   └── auth/             # Authentication API routes
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── AuthCheck.tsx         # Authentication guard component
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── DashboardLayout.tsx   # Dashboard layout wrapper
│   ├── ClientModal.tsx       # Client create/edit modal
│   └── TaskModal.tsx         # Task create/edit modal
├── lib/
│   ├── prisma.ts             # Prisma client instance
│   ├── session.ts            # Session configuration
│   ├── auth.ts               # Authentication helpers
│   └── constants.ts          # Application constants
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed data script
│   └── dev.db                # SQLite database (generated)
└── package.json
\`\`\`

## Build for Production

\`\`\`bash
npm run build
\`\`\`

Start the production server:

\`\`\`bash
npm start
\`\`\`

## Features Checklist

✅ **Completed Features:**
- Authentication system with password login
- Dashboard with application statistics and widgets
- Client management with full CRUD operations
- Client search and filtering by tags
- Application tracking with full CRUD operations
- **Drag-and-drop Kanban board** for applications
- Toggle between Table and Kanban views
- Task management with full CRUD operations
- Task filtering by status, category, and priority
- Document tracking with full CRUD operations
- Application detail pages with document management
- Client detail pages with editable notes
- Settings page with configuration constants
- Responsive sidebar navigation with mobile menu
- SQLite database with Prisma ORM
- Seed script with comprehensive sample data

🚀 **Potential Future Enhancements:**
- Email notifications for due dates
- File upload for documents (currently status tracking only)
- Reports and analytics
- Calendar view for tasks and closings
- Data export (CSV/Excel)
- Multi-user support with roles
- Advanced search across all entities

## Support

For issues or questions, please refer to the Next.js documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
