/**
 * Authentication Service
 * Handles all authentication-related operations using Supabase Auth
 */

import { supabase, supabaseAdmin } from '../config/supabase.js';
import type {
  SignUpCredentials,
  SignInCredentials,
  AuthResponse,
  OAuthSignInOptions,
  PasswordResetRequest,
  PasswordUpdate,
  AuthUser,
} from '../types/auth.types.js';
import type { UserProfile, UserProfileInsert } from '../types/database.types.js';
import type { ApiResponse } from '../types/common.types.js';

export class AuthService {
  /**
   * Sign up a new user with email and password
   */
  static async signUp(
    credentials: SignUpCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const { email, password, full_name, username } = credentials;

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            username,
          },
        },
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      // Create user profile if user was created
      if (data.user) {
        const profileData: UserProfileInsert = {
          id: data.user.id,
          full_name: full_name || null,
          username: username || null,
        };

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert(profileData);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Note: User account is created but profile failed
          // This should be handled by the application
        }
      }

      return {
        data: {
          user: data.user,
          session: data.session,
          error: null,
        },
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Sign up failed' },
        success: false,
      };
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(
    credentials: SignInCredentials
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const { email, password } = credentials;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: {
          user: data.user,
          session: data.session,
          error: null,
        },
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Sign in failed' },
        success: false,
      };
    }
  }

  /**
   * Sign in with OAuth provider (e.g., Google)
   */
  static async signInWithOAuth(
    options: OAuthSignInOptions
  ): Promise<ApiResponse<{ url: string }>> {
    try {
      const { provider, redirectTo } = options;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: { url: data.url },
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'OAuth sign in failed' },
        success: false,
      };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Sign out failed' },
        success: false,
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      if (!user) {
        return {
          data: null,
          error: { message: 'No user logged in' },
          success: false,
        };
      }

      return {
        data: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get current user' },
        success: false,
      };
    }
  }

  /**
   * Get the current session
   */
  static async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: session,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get session' },
        success: false,
      };
    }
  }

  /**
   * Request a password reset email
   */
  static async requestPasswordReset(
    request: PasswordResetRequest
  ): Promise<ApiResponse<null>> {
    try {
      const { email } = request;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.APP_URL}/reset-password`,
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Password reset request failed' },
        success: false,
      };
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(
    update: PasswordUpdate
  ): Promise<ApiResponse<null>> {
    try {
      const { password } = update;

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Password update failed' },
        success: false,
      };
    }
  }

  /**
   * Refresh the current session
   */
  static async refreshSession(): Promise<ApiResponse<AuthResponse>> {
    try {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: {
          user,
          session,
          error: null,
        },
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Session refresh failed' },
        success: false,
      };
    }
  }

  /**
   * Admin: Get user by ID (requires service role)
   */
  static async adminGetUser(userId: string): Promise<ApiResponse<AuthUser>> {
    try {
      if (!supabaseAdmin) {
        return {
          data: null,
          error: { message: 'Admin client not available' },
          success: false,
        };
      }

      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      if (!user) {
        return {
          data: null,
          error: { message: 'User not found' },
          success: false,
        };
      }

      return {
        data: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get user' },
        success: false,
      };
    }
  }

  /**
   * Admin: Delete user (requires service role)
   */
  static async adminDeleteUser(userId: string): Promise<ApiResponse<null>> {
    try {
      if (!supabaseAdmin) {
        return {
          data: null,
          error: { message: 'Admin client not available' },
          success: false,
        };
      }

      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.name },
          success: false,
        };
      }

      return {
        data: null,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to delete user' },
        success: false,
      };
    }
  }
}

