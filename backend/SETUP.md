# Supabase Setup Guide

This guide will help you set up Supabase for the Locked-In Toolbox backend.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Project name: `locked-in-toolbox`
   - Database password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (this takes a few minutes)

## Step 2: Get Your API Keys

1. Once the project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon/public key**: This is your `SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

3. Update your `.env` file:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 3: Run Database Migrations

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Run each migration file in order:

### Migration 1: Initial Schema
Copy and paste the contents of `supabase/migrations/001_initial_schema.sql` and click **Run**.

This creates:
- User profiles table
- Study sessions table
- Tasks table
- Flashcard decks and flashcards tables
- Study session tags table

### Migration 2: Row Level Security
Copy and paste the contents of `supabase/migrations/002_row_level_security.sql` and click **Run**.

This sets up security policies so users can only access their own data.

### Migration 3: Functions and Views
Copy and paste the contents of `supabase/migrations/003_functions_and_views.sql` and click **Run**.

This creates helper functions and views for analytics.

## Step 4: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (it should be enabled by default)
3. (Optional) Enable **Google** provider:
   - You'll need to set up OAuth credentials in Google Cloud Console
   - Follow the instructions in the Supabase dashboard
   - Add your Google Client ID and Secret

### Email Settings
1. Go to **Authentication** → **Email Templates**
2. Customize the email templates if desired:
   - Confirmation email
   - Password reset email
   - Magic link email

## Step 5: (Optional) Set Up Google Calendar Integration

For Google Calendar integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env` file:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Step 6: Test Your Setup

1. Start your backend:
   ```bash
   npm run dev
   ```

2. Test authentication:
   ```typescript
   import { AuthService } from './services/auth.service';
   
   // Try signing up a test user
   const result = await AuthService.signUp({
     email: 'test@example.com',
     password: 'testpassword123',
     full_name: 'Test User'
   });
   
   console.log(result);
   ```

## Verification Checklist

- [ ] Supabase project created and active
- [ ] API keys copied to `.env` file
- [ ] All three migrations run successfully
- [ ] Email authentication enabled
- [ ] Test user can sign up and sign in
- [ ] Database tables visible in Table Editor
- [ ] RLS policies active (check **Authentication** → **Policies**)

## Troubleshooting

### "relation does not exist"
- Make sure all migrations ran successfully
- Check the SQL Editor for any error messages
- Try running the migrations again

### "JWT expired" or "Invalid API key"
- Verify your API keys in `.env` are correct
- Make sure there are no extra spaces or quotes
- Try regenerating the keys in Supabase dashboard

### "new row violates row-level security policy"
- Make sure the user is authenticated
- Check that RLS policies are set up correctly
- Verify the user is trying to access their own data

### "Failed to fetch"
- Check your `SUPABASE_URL` is correct
- Verify your internet connection
- Make sure Supabase project is not paused

## Next Steps

Once setup is complete:
1. Test all backend services
2. Integrate with your React frontend
3. Set up environment variables for production
4. Configure your deployment pipeline

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

