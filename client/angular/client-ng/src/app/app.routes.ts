import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import { ClientRecipesReportComponent } from './components/client-recipes-report/client-recipes-report.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'displayUsers', component: DisplayUsersComponent },
  { path: 'user-report', component: UserReportComponent },
  { path: 'client-recipes-report', component: ClientRecipesReportComponent }
];
