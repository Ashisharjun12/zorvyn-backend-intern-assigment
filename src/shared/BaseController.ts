
import { Response } from 'express';
import { ApiResponse } from './ApiResponse.js';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200
  ): void {
    res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  protected sendCreated<T>(res: Response, data: T, message = 'Created') {
    this.sendSuccess(res, data, message, 201);
  }

  protected sendNoContent(res: Response): void {
    res.status(204).send();
  }
}