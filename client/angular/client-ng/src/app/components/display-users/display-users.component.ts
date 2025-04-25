import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { DisplayUsersService } from '../../services/display-users.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-display-users',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './display-users.component.html',
    styleUrl: './display-users.component.css'
})
export class DisplayUsersComponent {
  constructor(private usersService: DisplayUsersService) { }
  users$: Observable<User[]> = this.usersService.users;

  ngOnInit() {
    this.users$ = this.usersService.users;
    this.usersService.getUsers();
  }
}
