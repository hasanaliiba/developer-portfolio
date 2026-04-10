import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('is defined as a function', () => expect(authGuard).toBeDefined());
  it('is callable (CanActivateFn)', () => expect(typeof authGuard).toBe('function'));
});
