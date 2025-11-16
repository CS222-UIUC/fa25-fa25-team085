/**
 * Common types and utilities
 */

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

// API error structure
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Date range filter
export interface DateRangeFilter {
  start_date: string; // ISO timestamp
  end_date: string; // ISO timestamp
}

// Supabase query filter
export interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in';
  value: any;
}

