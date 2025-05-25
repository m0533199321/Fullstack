import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import { RecipeReportComponent } from './components/recipe-report/recipe-report.component';
import { ClientReportComponent } from './components/client-recipes-report/client-recipes-report.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { UserRecipesComponent } from './components/user-recipes/user-recipes.component';
import { AllRecipesComponent } from './components/all-recipes/all-recipes.component';
import { SearchComponent } from './components/search/search.component';
import { RecipeViewerComponent } from './components/recipe-viewer/recipe-viewer.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'users', component: DisplayUsersComponent },
  { path: 'user/:id', component: UserRecipesComponent },
  { path: 'user/:id/recipe/:recipeId', component: RecipeViewerComponent },
  { path: 'all-recipes', component: AllRecipesComponent },
  { path: 'recipe/:recipeId', component: RecipeViewerComponent },
  { path: 'search', component: SearchComponent },
  { path: 'graphs', component: GraphsComponent },
  { path: 'graphs/user-report', component: UserReportComponent },
  { path: 'graphs/client-recipes-report', component: ClientReportComponent },
  { path: 'graphs/recipe-report', component: RecipeReportComponent }
];
