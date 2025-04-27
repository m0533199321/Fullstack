import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { UserReportComponent } from './app/components/user-report/user-report.component';
import { ClientReportComponent } from './app/components/client-recipes-report/client-recipes-report.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
