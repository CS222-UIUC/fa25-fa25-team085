// Supabase client setup - ready for backend integration
// Replace with actual Supabase credentials when backend is ready

// For now, this is a placeholder structure
// When Supabase is set up, uncomment and configure:

/*
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
*/

// Placeholder functions for development - replace with actual Supabase calls
type AnyRow = { [key: string]: any }; //

const fStudySessions: AnyRow[] = []; //

export const supabase = {
  auth: {
    signUp: async (email: string, password: string) => {
      // TODO: Replace with actual Supabase auth.signUp
      console.log('Sign up:', email);
      return Promise.resolve({ data: { user: { id: '1', email, created_at: new Date().toISOString() } }, error: null });
    },
    signInWithPassword: async (email: string, password: string) => {
      // TODO: Replace with actual Supabase auth.signInWithPassword
      console.log('Sign in:', email);
      return Promise.resolve({ data: { user: { id: '1', email, created_at: new Date().toISOString() } }, error: null });
    },
    signOut: async () => {
      // TODO: Replace with actual Supabase auth.signOut
      console.log('Sign out');
      return Promise.resolve({ error: null });
    },
    getSession: async () => {
      // TODO: Replace with actual Supabase auth.getSession
      return Promise.resolve({ data: { session: null }, error: null });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // TODO: Replace with actual Supabase auth.onAuthStateChange
      return { data: { subscription: null }, unsubscribe: () => {} };
    },
  },
  from: (table: string) => {
    if (table === 'study_sessions') {
      return {
        select: (query?: string) => ({
          eq: (column: string, value: any) => ({
            order: (orderColumn: string, options?: { ascending?: boolean }) => {
              let rows = [...fStudySessions];

              if (column === 'user_id') {
                rows = rows.filter((row) => row.user_id === value);
              }

              rows.sort((a, b) => {
                const aTime = new Date(a.started_at ?? 0).getTime();
                const bTime = new Date(b.started_at ?? 0).getTime();
                if (options?.ascending) return aTime - bTime;
                return bTime - aTime;
              });

              console.log('supabase select study_sessions:', rows);
              return Promise.resolve({ data: rows, error: null });
            },
          }),
        }),

        // insert into study_sessions
        insert: (values: any) => {
          const rows = Array.isArray(values) ? values : [values];

          const withIds = rows.map((row, index) => ({
            id: row.id ?? String(fStudySessions.length + index + 1),
            ...row,
          }));

          fStudySessions.push(...withIds);
          console.log('supabase insert study_sessions:', withIds);

          return Promise.resolve({
            data: withIds,
            error: null,
          });
        },

        // no op update and delete for now
        update: (values: any) => ({
          eq: (column: string, value: any) => {
            console.log('supabase update study_sessions (ignored):', {
              values,
              column,
              value,
            });
            return Promise.resolve({ data: null, error: null });
          },
        }),
        delete: () => ({
          eq: (column: string, value: any) => {
            console.log('supabase delete study_sessions (ignored):', {
              column,
              value,
            });
            return Promise.resolve({ data: null, error: null });
          },
        }),
      };
    }

    // default stub behavior for other tables stays the same as before
    return {
      select: (query?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: { ascending?: boolean }) =>
            Promise.resolve({
              data: [],
              error: null,
            }),
        }),
      }),
      insert: (values: any) =>
        Promise.resolve({
          data: null,
          error: null,
        }),
      update: (values: any) => ({
        eq: (column: string, value: any) =>
          Promise.resolve({
            data: null,
            error: null,
          }),
      }),
      delete: () => ({
        eq: (column: string, value: any) =>
          Promise.resolve({
            data: null,
            error: null,
          }),
      }),
    };
  },
};


