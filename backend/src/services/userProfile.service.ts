/**
 * User Profile Service
 * Handles operations related to user profiles
 */

import { supabase } from '../config/supabase.js';
import type {
  UserProfile,
  UserProfileUpdate,
} from '../types/database.types.js';
import type { ApiResponse } from '../types/common.types.js';

export class UserProfileService {
  /**
   * Get user profile by user ID
   */
  static async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get profile' },
        success: false,
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: UserProfileUpdate
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to update profile' },
        success: false,
      };
    }
  }

  /**
   * Check if username is available
   */
  static async isUsernameAvailable(
    username: string,
    excludeUserId?: string
  ): Promise<ApiResponse<boolean>> {
    try {
      let query = supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username);

      if (excludeUserId) {
        query = query.neq('id', excludeUserId);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data: data.length === 0,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to check username' },
        success: false,
      };
    }
  }

  /**
   * Get profile by username
   */
  static async getProfileByUsername(
    username: string
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        return {
          data: null,
          error: { message: error.message, code: error.code },
          success: false,
        };
      }

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to get profile' },
        success: false,
      };
    }
  }
}

