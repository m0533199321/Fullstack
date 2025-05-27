import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { UserLogIn } from '../../models/auth.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, MatInputModule, MatIconModule, MatCardModule, MatStepperModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  userForm: FormGroup;
  hide: boolean = true;
  isLoading: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  toggleForm = () => {
    this.router.navigate(['']);
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  signIn() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    let userLoginIn: UserLogIn = new UserLogIn(
      this.userForm.get('email')?.value,
      this.userForm.get('password')?.value);

      this.authService.login(userLoginIn).subscribe({
      next: (response) => {        
        this.snackBar.open('sign in successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.router.navigate(['']);
      },
      error: (error) => {
        this.snackBar.open('User does not have admin role', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.userForm.reset();
      }
    });

  }
  
  cancelSignIn() {
    this.router.navigate(['']);
  }

}

