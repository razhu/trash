import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name); // Added context to Logger

  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Log error details
    this.logger.error(
      `${request.method} ${request.originalUrl} ${status} - error: ${exception.message}`,
    );

    // Handle the exception response, ensuring consistent formatting
    const errorDetail =
      typeof exception.getResponse() === 'string'
        ? { message: exception.getResponse() }
        : exception.getResponse();

    // Send the formatted error response to the client
    response.status(status).json({ error: true, errorDetail });
  }
}
