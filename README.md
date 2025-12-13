# Locked-In Toolbox (LIT)

Locked-In Toolbox is a web-based application that provides students with a comprehensive suite of study tools. LIT combines essential study tools like timers and flashcards with AI-powered analysis of study sessions, helping students understand whether their study habits are actually effective.

## (a) Summary of Presentation Introduction

Locked-In Toolbox addresses a common problem among students: the uncertainty of whether their study habits are effective. The application provides:

- **Study Timers**: Multiple timer modes including Pomodoro, countdown, stopwatch, and custom cycles
- **Task Management**: Create and track study tasks with completion status
- **Flashcards**: Create and review flashcards during study sessions
- **Session Tracking**: Automatically log study sessions with duration, tasks completed, and notes
- **AI-Powered Feedback**: Receive personalized feedback on study session performance
- **Analytics Dashboard**: View study statistics, completion rates, and study streaks
- **Calendar Integration**: Visualize study sessions on a calendar view

The application helps students make data-driven decisions about their study habits by providing insights into their study patterns and productivity.

## (b) Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **State Management**: React Context API (AuthContext, SessionContext)
- **Date Handling**: Day.js
- **Styling**: Emotion (CSS-in-JS) with Material-UI components

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Backend-as-a-Service**: Supabase
  - Authentication (email/password, OAuth)
  - Row Level Security (RLS) policies
  - REST API and JavaScript SDK
- **Language**: TypeScript
- **Database Migrations**: SQL migration files for schema management

### Key Components

**Frontend Structure:**
```
LIT-FrontEnd/
├── src/
│   ├── pages/          # Main application pages (Dashboard, Study, Login, Signup)
│   ├── components/     # Reusable UI components (Calendar, DateFilter, NavBar, etc.)
│   ├── contexts/       # React context providers (Auth, Session)
│   ├── lib/            # Utility libraries (Supabase client)
│   └── types/          # TypeScript type definitions
```

**Backend Structure:**
```
backend/
├── src/
│   ├── services/       # Business logic services (Auth, StudySession, Task, UserProfile)
│   ├── config/         # Configuration (Supabase client)
│   └── types/          # TypeScript type definitions
├── sessions/           # Study session storage functions
├── tasks/              # Task management functions
└── supabase/
    └── migrations/     # Database schema migrations
```

### Data Flow
1. **Authentication**: Users sign up/login via Supabase Auth
2. **Session Management**: Study sessions are tracked and stored in PostgreSQL
3. **Data Persistence**: All user data (sessions, tasks, flashcards) stored in Supabase
4. **Real-time Updates**: Frontend queries Supabase directly via JavaScript SDK
5. **Security**: Row Level Security ensures users can only access their own data

### External Integrations
- **Supabase**: Database, authentication, and API layer
- **Google Calendar API**: (Planned) Log study sessions to user's calendar
- **AI API**: (Planned) Generate personalized study feedback

## (c) Reproducible Installation Instructions

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/CS222-UIUC/fa25-fa25-team085.git
cd fa25-fa25-team085
```

### Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be provisioned

2. **Get Your API Keys**
   - Navigate to Settings → API in your Supabase dashboard
   - Copy your Project URL and anon/public key

3. **Run Database Migrations**
   - Go to SQL Editor in your Supabase dashboard
   - Run the following migrations in order:
     - `backend/supabase/migrations/001_initial_schema.sql`
     - `backend/supabase/migrations/002_row_level_security.sql`
     - `backend/supabase/migrations/003_functions_and_views.sql`

### Step 3: Set Up Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

4. **Verify backend setup:**
   ```bash
   npm run type-check
   ```

### Step 4: Set Up Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd ../LIT-FrontEnd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase client:**
   - Edit `src/lib/supabase.ts` and update with your Supabase URL and anon key:
   ```typescript
   const SUPABASE_URL = 'https://your-project-id.supabase.co'
   const SUPABASE_ANON_KEY = 'your-anon-key-here'
   ```

### Step 5: Run the Application

1. **Start the frontend development server:**
   ```bash
   cd LIT-FrontEnd
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

2. **Start the backend (optional, for development):**
   ```bash
   cd backend
   npm run dev
   ```

### Step 6: Create an Account

1. Open the application in your browser
2. Click "Sign Up" to create a new account
3. Verify your email (if email confirmation is enabled)
4. Log in and start using the application!

### Troubleshooting

- **"Missing Supabase environment variables"**: Ensure your `.env` file is properly configured
- **"Table does not exist"**: Make sure all database migrations have been run
- **"Row Level Security policy violation"**: Ensure the user is authenticated and trying to access their own data
- **Port already in use**: Change the port in `vite.config.ts` or kill the process using the port

## (d) Group Members and Their Roles

### Anya Kapoor
**Role**: Backend Developer  
**Responsibilities** (based on commit history):
- Designed and implemented complete database schema with PostgreSQL migrations
- Built comprehensive backend framework with authentication, study sessions, and task management services
- Created Supabase integration layer with TypeScript
- Implemented Row Level Security policies for data protection
- Developed backend functions: `saveStudySession()`, `createTask()`, `getTasks()`
- Set up TypeScript type definitions and API structure
- Created backend documentation (README, API_REFERENCE, SETUP guides)
- Created project README documentation

### Matthew Ju
**Role**: Frontend Developer  
**Responsibilities** (based on commit history):
- Implemented complete frontend UI/UX (Dashboard and Study page layout)
- Created all major frontend components: Calendar, DateFilter, NavBar, Plate, AIFeedback, ErrorBoundary, ProtectedRoute
- Built all application pages: Dashboard, Study, Login, Signup
- Developed React contexts: AuthContext, SessionContext
- Integrated Supabase client library for frontend
- Implemented authentication flow and protected routes
- Set up Material-UI styling and responsive design

### Hyunwoo Jee
**Role**: Frontend Developer  
**Responsibilities** (based on commit history):
- Initial frontend project setup (created LIT-FrontEnd directory structure)
- Updated Supabase client integration (`src/lib/supabase.ts`)
- Worked on dashboard integration and Supabase connectivity

---

## Additional Resources

- **Backend Documentation**: See `backend/README.md` for detailed backend documentation
- **API Reference**: See `backend/API_REFERENCE.md` for complete API documentation
- **Setup Guide**: See `backend/SETUP.md` for detailed Supabase setup instructions
- **Integration Guide**: See `backend/INTEGRATION_SUMMARY.md` for frontend integration help

## License

This project is part of CS222 coursework at UIUC.
