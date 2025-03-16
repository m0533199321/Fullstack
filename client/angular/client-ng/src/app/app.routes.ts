import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'signIn', component: SignInComponent },
];
