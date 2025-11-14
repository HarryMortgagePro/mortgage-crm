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
- Complete client information tracking
- Search and filter capabilities
- Client detail pages with application history
- Notes management

### Applications Tracking
- Comprehensive application details (property info, financials, dates)
- Table view with filters (status, lender, type, closing date)
- Application detail pages with tasks and documents
- Support for multiple loan types (Mortgage, HELOC, Personal, etc.)

### Tasks Management
- Task tracking with due dates, priorities, and categories
- Link tasks to clients and applications
- Filter by status, due date, and priority
- Overdue task alerts

### Document Tracking
- Track document status per application
- Multiple document types (T1, NOA, T4, Job Letter, etc.)
- Document status tracking (Requested, Received, Expired, Not Required)

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
│   ├── AuthGuard.tsx         # Authentication guard component
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── DashboardLayout.tsx   # Dashboard layout wrapper
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

## Features Roadmap

Current version includes:
- ✅ Authentication system
- ✅ Dashboard with key metrics
- ✅ Client management
- ✅ Application tracking
- ✅ Task management
- ✅ Document tracking
- ✅ Settings page

Potential future enhancements:
- Kanban drag-and-drop board for applications
- Advanced filtering and search
- Email notifications
- File upload for documents
- Reports and analytics
- Calendar view
- Data export (CSV/Excel)

## Support

For issues or questions, please refer to the Next.js documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
