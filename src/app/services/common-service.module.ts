import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './syncify/auth.service';
import { AppConfigService } from './app-config.service';
import { AppComponent } from '../app.component';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      },
    },
  ],
  bootstrap: [],
})
export class CommonServiceModule {}
