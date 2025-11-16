# API Reference

Complete reference for all backend services.

## Table of Contents
- [AuthService](#authservice)
- [UserProfileService](#userprofileservice)
- [StudySessionService](#studysessionservice)
- [TaskService](#taskservice)

---

## AuthService

Handles user authentication and session management.

### `signUp(credentials)`
Create a new user account.

**Parameters:**
```typescript
{
  email: string;
  password: string;
  full_name?: string;
  username?: string;
}
```

**Returns:** `ApiResponse<AuthResponse>`

**Example:**
```typescript
const result = await AuthService.signUp({
  email: 'user@example.com',
  password: 'securepassword123',
  full_name: 'John Doe',
  username: 'johndoe'
});
```

### `signIn(credentials)`
Sign in an existing user.

**Parameters:**
```typescript
{
  email: string;
  password: string;
}
```

**Returns:** `ApiResponse<AuthResponse>`

### `signInWithOAuth(options)`
Sign in with an OAuth provider.

**Parameters:**
```typescript
{
  provider: 'google' | 'github' | 'gitlab' | 'bitbucket';
  redirectTo?: string;
}
```

**Returns:** `ApiResponse<{ url: string }>`

### `signOut()`
Sign out the current user.

**Returns:** `ApiResponse<null>`

### `getCurrentUser()`
Get the currently authenticated user.

**Returns:** `ApiResponse<AuthUser>`

### `getSession()`
Get the current session.

**Returns:** `ApiResponse<Session>`

### `requestPasswordReset(request)`
Send a password reset email.

**Parameters:**
```typescript
{
  email: string;
}
```

**Returns:** `ApiResponse<null>`

### `updatePassword(update)`
Update the user's password.

**Parameters:**
```typescript
{
  password: string;
}
```

**Returns:** `ApiResponse<null>`

---

## UserProfileService

Manages user profile information.

### `getProfile(userId)`
Get a user's profile.

**Parameters:** `userId: string`

**Returns:** `ApiResponse<UserProfile>`

### `updateProfile(userId, updates)`
Update a user's profile.

**Parameters:**
- `userId: string`
- `updates: UserProfileUpdate`

**Returns:** `ApiResponse<UserProfile>`

**Example:**
```typescript
const result = await UserProfileService.updateProfile(userId, {
  full_name: 'Jane Doe',
  username: 'janedoe',
  avatar_url: 'https://...'
});
```

### `isUsernameAvailable(username, excludeUserId?)`
Check if a username is available.

**Parameters:**
- `username: string`
- `excludeUserId?: string` (optional, for updating own username)

**Returns:** `ApiResponse<boolean>`

### `getProfileByUsername(username)`
Get a profile by username.

**Parameters:** `username: string`

**Returns:** `ApiResponse<UserProfile>`

---

## StudySessionService

Manages study sessions and analytics.

### `createSession(sessionData)`
Start a new study session.

**Parameters:**
```typescript
{
  user_id: string;
  session_type: 'pomodoro' | 'countdown' | 'stopwatch' | 'custom';
  start_time: string; // ISO timestamp
  target_duration_minutes?: number;
  session_notes?: string;
}
```

**Returns:** `ApiResponse<StudySession>`

**Example:**
```typescript
const session = await StudySessionService.createSession({
  user_id: userId,
  session_type: 'pomodoro',
  start_time: new Date().toISOString(),
  target_duration_minutes: 25
});
```

### `getSession(sessionId)`
Get a study session by ID.

**Parameters:** `sessionId: string`

**Returns:** `ApiResponse<StudySession>`

### `updateSession(sessionId, updates)`
Update a study session.

**Parameters:**
- `sessionId: string`
- `updates: StudySessionUpdate`

**Returns:** `ApiResponse<StudySession>`

### `endSession(sessionId, endData?)`
End a study session.

**Parameters:**
- `sessionId: string`
- `endData?: { mood_rating?: number; productivity_rating?: number; session_notes?: string; }`

**Returns:** `ApiResponse<StudySession>`

**Example:**
```typescript
await StudySessionService.endSession(sessionId, {
  mood_rating: 4,
  productivity_rating: 5,
  session_notes: 'Great session!'
});
```

### `deleteSession(sessionId)`
Delete a study session.

**Parameters:** `sessionId: string`

**Returns:** `ApiResponse<null>`

### `getUserSessions(userId, options?)`
Get all study sessions for a user.

**Parameters:**
- `userId: string`
- `options?: { limit?: number; offset?: number; orderBy?: string; orderDirection?: 'asc' | 'desc'; dateRange?: { start_date: string; end_date: string } }`

**Returns:** `ApiResponse<StudySession[]>`

### `getActiveSession(userId)`
Get the current active (ongoing) session for a user.

**Parameters:** `userId: string`

**Returns:** `ApiResponse<StudySession | null>`

### `getUserStats(userId)`
Get study statistics for a user.

**Parameters:** `userId: string`

**Returns:** `ApiResponse<UserStudyStats>`

**Example:**
```typescript
const stats = await StudySessionService.getUserStats(userId);
// Returns: total_sessions, total_minutes_studied, avg_session_duration, etc.
```

### `getDailySummary(userId, dateRange?)`
Get daily study summary.

**Parameters:**
- `userId: string`
- `dateRange?: { start_date: string; end_date: string }`

**Returns:** `ApiResponse<DailyStudySummary[]>`

### `getStudyStreak(userId)`
Get the user's current study streak (consecutive days).

**Parameters:** `userId: string`

**Returns:** `ApiResponse<number>`

### `addSessionTags(sessionId, tags)`
Add tags to a study session.

**Parameters:**
- `sessionId: string`
- `tags: string[]`

**Returns:** `ApiResponse<StudySessionTag[]>`

### `getSessionTags(sessionId)`
Get tags for a study session.

**Parameters:** `sessionId: string`

**Returns:** `ApiResponse<StudySessionTag[]>`

### `removeSessionTag(sessionId, tag)`
Remove a tag from a study session.

**Parameters:**
- `sessionId: string`
- `tag: string`

**Returns:** `ApiResponse<null>`

### `getSessionsByTag(userId, tag)`
Get all sessions with a specific tag.

**Parameters:**
- `userId: string`
- `tag: string`

**Returns:** `ApiResponse<StudySession[]>`

---

## TaskService

Manages user tasks and to-do lists.

### `createTask(taskData)`
Create a new task.

**Parameters:**
```typescript
{
  user_id: string;
  title: string;
  description?: string;
  priority?: 0 | 1 | 2 | 3; // none, low, medium, high
  due_date?: string; // ISO timestamp
  session_id?: string;
}
```

**Returns:** `ApiResponse<Task>`

**Example:**
```typescript
const task = await TaskService.createTask({
  user_id: userId,
  title: 'Complete homework',
  description: 'Math problems 1-10',
  priority: 3,
  due_date: '2025-10-10T00:00:00Z'
});
```

### `getTask(taskId)`
Get a task by ID.

**Parameters:** `taskId: string`

**Returns:** `ApiResponse<Task>`

### `updateTask(taskId, updates)`
Update a task.

**Parameters:**
- `taskId: string`
- `updates: TaskUpdate`

**Returns:** `ApiResponse<Task>`

### `deleteTask(taskId)`
Delete a task.

**Parameters:** `taskId: string`

**Returns:** `ApiResponse<null>`

### `getUserTasks(userId, options?)`
Get all tasks for a user.

**Parameters:**
- `userId: string`
- `options?: { completed?: boolean; sessionId?: string; limit?: number; }`

**Returns:** `ApiResponse<Task[]>`

**Example:**
```typescript
// Get all incomplete tasks
const tasks = await TaskService.getUserTasks(userId, {
  completed: false
});

// Get tasks for a specific session
const sessionTasks = await TaskService.getUserTasks(userId, {
  sessionId: sessionId
});
```

### `toggleTaskCompletion(taskId)`
Toggle task completion status.

**Parameters:** `taskId: string`

**Returns:** `ApiResponse<Task>`

### `getTaskCompletionRate(userId)`
Get task completion rate as a percentage.

**Parameters:** `userId: string`

**Returns:** `ApiResponse<number>`

### `reorderTasks(taskUpdates)`
Reorder multiple tasks.

**Parameters:**
```typescript
Array<{
  id: string;
  order_index: number;
}>
```

**Returns:** `ApiResponse<null>`

---

## Common Types

### `ApiResponse<T>`
```typescript
{
  data: T | null;
  error: ApiError | null;
  success: boolean;
}
```

### `ApiError`
```typescript
{
  message: string;
  code?: string;
  details?: any;
}
```

### `DateRangeFilter`
```typescript
{
  start_date: string; // ISO timestamp
  end_date: string;   // ISO timestamp
}
```

---

## Error Handling

All service methods return an `ApiResponse` with a consistent structure:

```typescript
const result = await SomeService.someMethod();

if (result.success) {
  // Use result.data
  console.log(result.data);
} else {
  // Handle result.error
  console.error(result.error.message);
}
```

## Usage with Frontend

Import services in your React components:

```typescript
import { AuthService, StudySessionService } from '../backend/src/services';

// Use in async functions or useEffect
const handleStartSession = async () => {
  const result = await StudySessionService.createSession({
    user_id: currentUser.id,
    session_type: 'pomodoro',
    start_time: new Date().toISOString(),
    target_duration_minutes: 25
  });
  
  if (result.success) {
    setCurrentSession(result.data);
  } else {
    alert(result.error.message);
  }
};
```

