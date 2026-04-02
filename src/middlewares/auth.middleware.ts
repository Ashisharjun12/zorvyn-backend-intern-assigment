import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { _config } from '../config/config.js';
import { ApiError } from '../shared/ApiError.js';
import type { UserRole } from '../modules/users/user.schema.js';

interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
  iat?:  number;
  exp?:  number;
}


// authenticate middleware
 
export const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = authHeader.slice(7); 

  try {
    const payload = jwt.verify(token, _config.JWT_SECRET!) as JwtPayload;

    req.user = {
      id:    payload.id,
      role:  payload.role,
      email: payload.email,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized('Token has expired. Please log in again.'));
    }
    return next(ApiError.unauthorized('Invalid token'));
  }
};
