import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { UserRegister } from '../../models/auth.model';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatIconModule, MatStepperModule, MatCardModule, MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDialogModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  userForm: FormGroup;
  hide: boolean = true;
  step: number = 1;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.userForm = this.fb.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
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

  onSubmit() {
    if (this.userForm.invalid) {
      console.log("inavlid");
      this.userForm.markAllAsTouched();
      return;
    }

    let userRegister: UserRegister = new UserRegister(
      this.userForm.get('fName')?.value,
      this.userForm.get('lName')?.value,
      this.userForm.get('email')?.value,
      this.userForm.get('password')?.value,
      "", [], "", "", ""
    );
    this.authService.register(userRegister);
    this.router.navigate(['']);
  }
}