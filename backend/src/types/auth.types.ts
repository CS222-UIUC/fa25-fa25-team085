/**
 * Authentication-related type definitions
 */

import { User, Session } from '@supabase/supabase-js';

// Sign up with email and password
export interface SignUpCredentials {
  email: string;
  password: string;
  full_name?: string;
  username?: string;
}

// Sign in with email and password
export interface SignInCredentials {
  email: string;
  password: string;
}

// Auth response from Supabase
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

// Auth user information
export interface AuthUser {
  id: string;
  email: string | undefined;
  created_at: string;
  last_sign_in_at: string | undefined;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password update
export interface PasswordUpdate {
  password: string;
}

// OAuth provider types
export type OAuthProvider = 'google' | 'github' | 'gitlab' | 'bitbucket';

// Sign in with OAuth
export interface OAuthSignInOptions {
  provider: OAuthProvider;
  redirectTo?: string;
}

