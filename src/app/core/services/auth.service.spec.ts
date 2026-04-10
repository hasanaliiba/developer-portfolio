import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('is defined as a class', () => expect(AuthService).toBeDefined());
  it('exposes signInWithGoogle on prototype', () => expect(typeof AuthService.prototype.signInWithGoogle).toBe('function'));
  it('exposes signOut on prototype', () => expect(typeof AuthService.prototype.signOut).toBe('function'));
  it('exposes isLoggedIn on prototype', () => expect(typeof AuthService.prototype.isLoggedIn).toBe('function'));
});
