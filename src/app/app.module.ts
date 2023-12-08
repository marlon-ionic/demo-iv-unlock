import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { VaultService } from './services/vault.service';

// Per https://ionic.io/docs/identity-vault/troubleshooting#the-fix
const vaultInitFactory =
  (vaultService: VaultService): (() => Promise<void>) =>
  async () => await vaultService.init();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    { provide: APP_INITIALIZER, useFactory: vaultInitFactory, deps: [VaultService], multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
