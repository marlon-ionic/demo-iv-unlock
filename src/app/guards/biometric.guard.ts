import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { VaultService } from '../services/vault.service';

@Injectable({
  providedIn: 'root'
})
export class BiometricGuard implements CanActivate {
  constructor(private readonly vaultService: VaultService) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      await this.vaultService.lock();
    return true;
  }

}

// Function version of the guard. Introduced in Angular 15
const biometricGuardFn: CanActivateFn =
    async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const vaultService = inject(VaultService);
      await vaultService.lock();
      return true;
    };
