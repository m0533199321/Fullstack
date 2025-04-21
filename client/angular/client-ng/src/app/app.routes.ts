import { Routes } from '@angular/router';
// import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DisplayUsersComponent } from './components/display-users/display-users.component';

export const routes: Routes = [
    // { path: '', component: HomeComponent },
    // { path: 'signUp', component: SignUpComponent },
    { path: 'signIn', component: SignInComponent },
    {path: 'displayUsers', component: DisplayUsersComponent},
];
