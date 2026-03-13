import { describe, it, expect } from 'vitest';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

describe('AppError hierarchy', () => {
  describe('ValidationError', () => {
    it('has correct code and statusCode', () => {
      const err = new ValidationError('bad input');
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.statusCode).toBe(400);
      expect(err.isOperational).toBe(true);
      expect(err.message).toBe('bad input');
    });

    it('is an instance of AppError and Error', () => {
      const err = new ValidationError('bad input');
      expect(err).toBeInstanceOf(AppError);
      expect(err).toBeInstanceOf(Error);
    });
  });

  describe('AuthenticationError', () => {
    it('has correct code and statusCode', () => {
      const err = new AuthenticationError('not logged in');
      expect(err.code).toBe('UNAUTHENTICATED');
      expect(err.statusCode).toBe(401);
      expect(err.isOperational).toBe(true);
    });

    it('is an instance of AppError', () => {
      expect(new AuthenticationError('x')).toBeInstanceOf(AppError);
    });
  });

  describe('ForbiddenError', () => {
    it('has correct code and statusCode', () => {
      const err = new ForbiddenError('forbidden');
      expect(err.code).toBe('FORBIDDEN');
      expect(err.statusCode).toBe(403);
      expect(err.isOperational).toBe(true);
    });

    it('is an instance of AppError', () => {
      expect(new ForbiddenError('x')).toBeInstanceOf(AppError);
    });
  });

  describe('NotFoundError', () => {
    it('has correct code and statusCode', () => {
      const err = new NotFoundError('Task', '123');
      expect(err.code).toBe('NOT_FOUND');
      expect(err.statusCode).toBe(404);
      expect(err.isOperational).toBe(true);
    });

    it('includes resource name and id in message', () => {
      const err = new NotFoundError('Task', 'abc');
      expect(err.message).toContain('Task');
      expect(err.message).toContain('abc');
    });

    it('is an instance of AppError', () => {
      expect(new NotFoundError('Task', '1')).toBeInstanceOf(AppError);
    });
  });
});
