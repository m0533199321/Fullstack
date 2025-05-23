import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import { RecipeReportComponent } from './components/recipe-report/recipe-report.component';
import { ClientReportComponent } from './components/client-recipes-report/client-recipes-report.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { UserRecipesComponent } from './components/user-recipes/user-recipes.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'users', component: DisplayUsersComponent },
  { path: 'users/:id/recipes', component: UserRecipesComponent },
  { path: 'graphs', component: GraphsComponent },
  { path: 'graphs/user-report', component: UserReportComponent },
  { path: 'graphs/client-recipes-report', component: ClientReportComponent },
  { path: 'graphs/recipe-report', component: RecipeReportComponent }
];
