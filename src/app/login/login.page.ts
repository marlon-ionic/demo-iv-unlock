import { Component, OnInit } from '@angular/core';
import { VaultService } from '../services/vault.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(private readonly vaultService: VaultService) { }

  async unlock() {
    await this.vaultService.unlock();
  }

}
