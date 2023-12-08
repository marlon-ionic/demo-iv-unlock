import { TestBed } from '@angular/core/testing';

import { BiometricGuard } from './biometric.guard';

describe('BiometricGuard', () => {
  let guard: BiometricGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BiometricGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
