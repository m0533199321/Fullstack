import { Component, NgModule } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { DisplayUsersService } from '../../services/display-users.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-display-users',
  standalone: true,
  imports: [AsyncPipe, FormsModule, MatSnackBarModule],
  templateUrl: './display-users.component.html',
  styleUrl: './display-users.component.css'
})
export class DisplayUsersComponent {
  constructor(private usersService: DisplayUsersService, private snackBar: MatSnackBar, private router:Router) { }
  users$: Observable<User[]> = this.usersService.users;
  add: boolean = false;
  loadingUserDelete: number | null = null;
  loadingUserAdd: boolean = false;
  
  // Confirmation dialog
  showConfirmDialog: boolean = false;
  confirmDialogData: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null = null;

  newUser: User = {
    id: 0,
    fName: '',
    lName: '',
    email: '',
    password: '',
    createdAt: new Date(),
    profile: "https://malismartchef.s3.us-east-1.amazonaws.com/images/1.jpg",
    rolesList: [],
    recipesList: []
  };

  errorMessages: { [key: string]: string } = {
    fName: '',
    lName: '',
    email: '',
    password: ''
  };

  searchTerm = ""

  get filteredUsers$(): Observable<User[]> {
    return this.users$.pipe(
      map((users) => {
        if (!this.searchTerm.trim()) {
          return users
        }

        const searchLower = this.searchTerm.toLowerCase()
        return users.filter(
          (user) =>
            user.fName.toLowerCase().includes(searchLower) ||
            user.lName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            `${user.fName} ${user.lName}`.toLowerCase().includes(searchLower),
        )
      }),
    )
  }

  clearSearch(): void {
    this.searchTerm = ""
  }

  ngOnInit() {
    this.users$ = this.usersService.users;
    this.usersService.getUsers();    
  }

  viewUser(userId: number): void {
    this.router.navigate(["/users", userId])
  }

  isFormValid(): boolean {
    this.errorMessages = {
      fName: '',
      lName: '',
      email: '',
      password: ''
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;

    if (this.newUser.fName.trim() === '') {
      this.errorMessages['fName'] = 'First Name is required.';
    }
    if (this.newUser.lName.trim() === '') {
      this.errorMessages['lName'] = 'Last Name is required.';
    }
    if (!emailPattern.test(this.newUser.email)) {
      this.errorMessages['email'] = 'Email is not valid.';
    }
    if (!passwordPattern.test(this.newUser.password)) {
      this.errorMessages['password'] = 'Password must be at least 6 characters long and include a number and a special character.';
    }

    return Object.values(this.errorMessages).every(msg => msg === '');
  }

  clearError(field: string): void {
    
    if (field === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newUser.email)) {
      this.errorMessages[field] = ''; 
    } else if (field === 'password' && /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/.test(this.newUser.password)) {
      this.errorMessages[field] = ''; 
    } else if (field === 'fName' && this.newUser.fName.trim() !== '') {
      this.errorMessages[field] = ''; 
    } else if (field === 'lName' && this.newUser.lName.trim() !== '') {
      this.errorMessages[field] = '';
    }
  }

  deleteUser(userId: number, userName: string) {
    this.showConfirmationDialog(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone and will also delete all their recipes.`,
      'Delete',
      'Cancel',
      () => this.confirmDeleteUser(userId),
      () => this.hideConfirmationDialog()
    );
  }

  confirmDeleteUser(userId: number): void {
    this.loadingUserDelete = userId;
    this.hideConfirmationDialog();
    this.usersService.deleteUserWithRecipes(userId).subscribe({
      next: () => {
        this.loadingUserDelete = null
        this.snackBar.open("User and their private recipes deleted successfully!", "Close", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
        })
      },
      error: (error) => {
        this.loadingUserDelete = null
        this.snackBar.open("Failed to delete user. Please try again.", "Close", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
        })
      },
    })
  }

  addForm() {
    this.add = true;
  }

  addUser() {
    if (!this.isFormValid()) {
      return;;
    }
    this.usersService.addUser(this.newUser).subscribe({
      next: (response) => {
        this.snackBar.open('User added successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to add user.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
    this.add = false;
    this.resetForm();
  }

  cancelAdd() {
    this.add = false;
    this.resetForm();
  }

  resetForm() {
    this.newUser = {
      id: 0,
      fName: '',
      lName: '',
      email: '',
      password: '',
      createdAt: new Date(),
      profile: "https://malismartchef.s3.us-east-1.amazonaws.com/images/1.jpg",
      rolesList: [],
      recipesList: []
    };
  }

  goBack = () => {
    this.router.navigate(['-1']);
  }

  viewUserRecipes(userId: number) {
    this.router.navigate(['/user', userId ]);
  }

  showConfirmationDialog(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    onConfirm: () => void,
    onCancel: () => void
  ): void {
    this.confirmDialogData = {
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    };
    this.showConfirmDialog = true;
  }

  hideConfirmationDialog(): void {
    this.showConfirmDialog = false;
    this.confirmDialogData = null;
  }
}
