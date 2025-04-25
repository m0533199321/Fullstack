import { Component, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { DisplayUsersService } from '../../services/display-users.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-display-users',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './display-users.component.html',
  styleUrl: './display-users.component.css'
})
export class DisplayUsersComponent {
  constructor(private usersService: DisplayUsersService) { }
  users$: Observable<User[]> = this.usersService.users;
  add: boolean = false;
  newUser: User = {
    id: 0,
    fName: '',
    lName: '',
    email: '',
    password: '',
    createdAt: new Date(),
    profile: "https://malismartchef.s3.amazonaws.com/images/profile-smartChef.png1745511305206",
    recipesList: []
  };

  ngOnInit() {
    this.users$ = this.usersService.users;
    this.usersService.getUsers();
  }

  deleteUser(userId: number) {
    this.usersService.deleteUser(userId);
  }

  addForm() {
    this.add = true;
  }

  addUser() {
    this.usersService.addUser(this.newUser);
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
      profile: "https://malismartchef.s3.amazonaws.com/images/profile-smartChef.png1745511305206",
      recipesList: []
    };
  }
}
