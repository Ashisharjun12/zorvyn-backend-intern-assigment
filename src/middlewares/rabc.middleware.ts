import type { RequestHandler } from 'express';
import { ApiError } from '../shared/ApiError.js';
import type { UserRole } from '../modules/users/user.schema.js';

//roles
export const ROLES={
  ADMIN:"admin",
  ANALYST:"analyst",
  VIEWER:"viewer"
} as const

//custom role middleware
 
export const customRole = (...roles: (typeof ROLES)[keyof typeof ROLES][]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role: [${roles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };