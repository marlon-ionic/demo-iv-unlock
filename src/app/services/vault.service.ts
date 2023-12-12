import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BrowserVault, Device, DeviceSecurityType, IdentityVaultConfig, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private isLockedSubject = new BehaviorSubject<boolean>(true);
  private vault?: Vault | BrowserVault;

  // Observable version of the isLocked property that can be used to react to vault lock/unlock events.
  isLocked$ = this.isLockedSubject.asObservable();

  constructor(private readonly zone: NgZone) { }

  // Initialize the vault. This method is called via an APP_INITIALIZER in app.module.ts
  async init() {

    // Determine the vault type based on the platform. Use the DeviceSecurityType.Biometrics for native platforms
    const isNativePlatform = Capacitor.isNativePlatform();
    const canUseBiometrics = await Device.isBiometricsEnabled();
    const config: IdentityVaultConfig = {
      key: 'io.ionic.demo-iv',
      type: canUseBiometrics ? VaultType.DeviceSecurity : VaultType.SecureStorage,
      deviceSecurityType: canUseBiometrics ? DeviceSecurityType.Biometrics: DeviceSecurityType.None,
      shouldClearVaultAfterTooManyFailedAttempts: false,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    };

    // Per https://ionic.io/docs/identity-vault/troubleshooting#use-initialize (initialize() available since 5.11.0)
    // Create the vault instance with an empty config. Use the initialize() method to configure the vault.
    // This ensure that the native platform's is pro.
    this.vault = isNativePlatform ? new Vault() : new BrowserVault();

    // Initialize the vault via the new initialize() method
    await this.vault?.initialize(config);

    //Initialize the vault's lock state
    const isLocked = await this.vault?.isLocked();
    this.isLockedSubject.next(isLocked);

    // Subscribe to the vault's lock/unlock events
    this.vault?.onLock(() => {
      console.log('Vault locked');
      this.zone.run(() => {
        this.isLockedSubject.next(true);
      });
    });
    this.vault?.onUnlock(() => {
      console.log('Vault unlocked');
      this.zone.run(() => {
        this.isLockedSubject.next(false);
      });
    });
    this.vault?.onError((e) => {
      console.warn('Vault error', e);
    });

    console.log('Vault initialized', 'isLocked', isLocked);
  }

  async isLocked(): Promise<boolean> {
    this.checkForVault();
    const isLocked = await this.vault?.isLocked();
    return isLocked ?? false;
  }

  async clear() {
    this.checkForVault();
    await this.vault?.clear();
  }

  async unlock() {
    this.checkForVault();
    await this.vault?.unlock();
  }

  async lock() {
    this.checkForVault();
    await this.vault?.lock();
  }

  async get<T>(key: string): Promise<T|null> {
    if(this.vault !== undefined) {
      return await this.vault?.getValue<T>(key);
    }
    return null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.checkForVault();
    await this.vault?.setValue<T>(key, value);
  }

  private checkForVault():void {
    if(this.vault === undefined) {
      throw new Error('Vault not initialized');
    }
  }
}
