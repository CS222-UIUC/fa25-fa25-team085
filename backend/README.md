# Locked-In Toolbox - Backend

Backend services for the Locked-In Toolbox application, built with Supabase and TypeScript.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- TypeScript knowledge

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

3. **Set up the database:**

   Once your Supabase project is active, run the migrations in order:
   
   Go to your Supabase Dashboard → SQL Editor and run:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_row_level_security.sql`
   - `supabase/migrations/003_functions_and_views.sql`

4. **Run the backend:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── services/
│   │   ├── auth.service.ts      # Authentication operations
│   │   ├── userProfile.service.ts # User profile management
│   │   ├── studySession.service.ts # Study session tracking
│   │   ├── task.service.ts      # Task management
│   │   └── index.ts             # Service exports
│   ├── types/
│   │   ├── auth.types.ts        # Auth type definitions
│   │   ├── database.types.ts    # Database entity types
│   │   ├── common.types.ts      # Common utility types
│   │   └── index.ts             # Type exports
│   └── index.ts                 # Main entry point
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql      # Database tables
│       ├── 002_row_level_security.sql  # RLS policies
│       └── 003_functions_and_views.sql # Helper functions
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔐 Authentication

The backend uses Supabase Auth for user management. Supported features:

- **Email/Password sign-up and sign-in**
- **OAuth providers** (Google, GitHub, etc.)
- **Password reset**
- **Session management**
- **User profiles**

### Example Usage

```typescript
import { AuthService } from './services/auth.service';

// Sign up
const result = await AuthService.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  full_name: 'John Doe',
  username: 'johndoe'
});

// Sign in
const session = await AuthService.signIn({
  email: 'user@example.com',
  password: 'securepassword'
});

// Get current user
const user = await AuthService.getCurrentUser();
```

## 📊 Study Sessions

Track study sessions with detailed metrics:

```typescript
import { StudySessionService } from './services/studySession.service';

// Start a study session
const session = await StudySessionService.createSession({
  user_id: userId,
  session_type: 'pomodoro',
  start_time: new Date().toISOString(),
  target_duration_minutes: 25
});

// End a session with feedback
await StudySessionService.endSession(session.data.id, {
  mood_rating: 4,
  productivity_rating: 5,
  session_notes: 'Great focus today!'
});

// Get user statistics
const stats = await StudySessionService.getUserStats(userId);
```

## ✅ Tasks

Manage tasks with priorities and completion tracking:

```typescript
import { TaskService } from './services/task.service';

// Create a task
const task = await TaskService.createTask({
  user_id: userId,
  title: 'Complete homework',
  description: 'Math problems 1-10',
  priority: 3, // high priority
  due_date: '2025-10-10T00:00:00Z'
});

// Toggle completion
await TaskService.toggleTaskCompletion(task.data.id);

// Get completion rate
const rate = await TaskService.getTaskCompletionRate(userId);
```

## 🗄️ Database Schema

### Core Tables

- **`user_profiles`**: Extended user information
- **`study_sessions`**: Study session records
- **`tasks`**: User tasks with completion status
- **`flashcard_decks`**: Flashcard collections
- **`flashcards`**: Individual flashcards
- **`study_session_tags`**: Tags for categorizing sessions

### Views

- **`user_study_stats`**: Aggregated study statistics per user
- **`daily_study_summary`**: Daily study summaries

### Functions

- **`get_study_streak(user_id)`**: Calculate consecutive study days
- **`get_task_completion_rate(user_id)`**: Calculate task completion percentage

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Service role key required for admin operations
- All queries are type-safe with TypeScript

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run built JavaScript
- `npm run type-check` - Check TypeScript types without building

### Type Safety

All database operations are fully typed. TypeScript will catch errors at compile time:

```typescript
// ✅ Type-safe
const session: StudySession = await StudySessionService.getSession(id);

// ❌ TypeScript error - invalid field
const invalid = await StudySessionService.createSession({
  user_id: userId,
  invalid_field: 'error' // TypeScript will catch this
});
```

## 🔄 Integration with Frontend

The frontend can import and use these services directly:

```typescript
// In your React components
import { AuthService, StudySessionService } from '../backend/src/services';

async function handleSignIn(email: string, password: string) {
  const result = await AuthService.signIn({ email, password });
  if (result.success) {
    // Handle successful sign in
  }
}
```

Or use the Supabase client directly:

```typescript
import { supabase } from '../backend/src/config/supabase';

// Subscribe to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
});
```

## 📝 Future Enhancements

- [ ] Google Calendar API integration
- [ ] AI feedback generation (OpenAI/Claude integration)
- [ ] Flashcard spaced repetition algorithm
- [ ] Export data functionality
- [ ] Analytics dashboard endpoints

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
Make sure your `.env` file exists and contains valid Supabase credentials.

### "Table does not exist"
Run all database migrations in the Supabase SQL Editor in order.

### "Row Level Security policy violation"
Ensure the user is authenticated and trying to access their own data.

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When adding new features:
1. Add database migrations in `supabase/migrations/`
2. Define TypeScript types in `src/types/`
3. Create service methods in `src/services/`
4. Update this README with usage examples

---

**Note:** This backend is designed to work seamlessly with Supabase. Once your Supabase project is unpaused, run the migrations and configure your `.env` file to get started.

