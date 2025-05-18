// Custom Error class
class AppError extends Error {
    constructor(message, statusCode = 500, errors = []) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Error türleri
  const errorTypes = {
    VALIDATION_ERROR: 'ValidationError',
    AUTHENTICATION_ERROR: 'AuthenticationError',
    AUTHORIZATION_ERROR: 'AuthorizationError',
    NOT_FOUND_ERROR: 'NotFoundError',
    DATABASE_ERROR: 'DatabaseError',
    SERVER_ERROR: 'ServerError'
  };
  
  module.exports = { AppError, errorTypes };