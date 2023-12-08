import { Component, OnDestroy, OnInit } from '@angular/core';
import { VaultService } from '../services/vault.service';
import { Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  isLocked$?: Observable<boolean>;
  vaultStatus: 'locked' | 'unlocked' | 'unknown' = 'unknown';
  vaultLockSubscription?: Subscription;
  constructor(private readonly vaultService: VaultService) {
  }

  ngOnDestroy(): void {
    this.vaultLockSubscription?.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.vaultLockSubscription = this.vaultService.isLocked$.subscribe((isLocked) => {
      console.log('vault.isLocked', isLocked);
      this.vaultStatus = isLocked ? 'locked' : 'unlocked';
    });
  }
  async unlock() {
    await this.vaultService.unlock();
  }

  async lock() {
    await this.vaultService.lock();
  }

}
