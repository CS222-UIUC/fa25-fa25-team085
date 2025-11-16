/**
 * Main entry point for the backend
 * Demonstrates how to use the services
 */

import { AuthService, StudySessionService, TaskService, UserProfileService } from './services/index.js';
import type { SignUpCredentials } from './types/index.js';

// Example usage - you can remove this once you integrate with your frontend
async function main() {
  console.log('Locked-In Toolbox Backend');
  console.log('========================');
  console.log('Backend services initialized and ready to use.');
  console.log('');
  console.log('Available services:');
  console.log('- AuthService: User authentication and session management');
  console.log('- UserProfileService: User profile operations');
  console.log('- StudySessionService: Study session tracking');
  console.log('- TaskService: Task management');
  console.log('');
  console.log('Make sure to configure your .env file with Supabase credentials.');
}

// Run example
main().catch(console.error);

// Export services for use in other modules
export * from './services/index.js';
export * from './types/index.js';
export { supabase, supabaseAdmin } from './config/supabase.js';

