import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BrowserVault, DeviceSecurityType, IdentityVaultConfig, Vault, VaultType } from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  private vault?: Vault | BrowserVault;
  constructor() { }


  async init() {
    const isNativePlatform = Capacitor.isNativePlatform();
    const config: IdentityVaultConfig = {
      key: 'io.ionic.demo-iv',
      type: isNativePlatform ? VaultType.DeviceSecurity : VaultType.SecureStorage,
      deviceSecurityType: isNativePlatform ? DeviceSecurityType.Biometrics: DeviceSecurityType.None,
      shouldClearVaultAfterTooManyFailedAttempts: false,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    };

    // Per https://ionic.io/docs/identity-vault/troubleshooting#use-initialize (initialize() available since 5.11.0)
    this.vault = isNativePlatform ? new Vault() : new BrowserVault();
    await this.vault?.initialize(config);
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
