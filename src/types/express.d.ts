

import type { UserRole } from '../modules/users/user.schema.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id:    string;
        role:  UserRole;
        email: string;
      };
    }
  }
}
