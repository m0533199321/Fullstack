import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { UserLogIn, UserRegister } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7005/api/Auth';

  constructor(private http: HttpClient, private userService: UserService) { }

  register(user: UserRegister) {
    console.log(user);   
    this.http.post<any>(this.baseUrl + '/register', user).subscribe(
      data => {
        console.log(data.token);
        console.log('Registration successful:', data);
        sessionStorage.setItem('token', data.token);   
        this.userService.getById(data.user.id);
      },
      error => {
        console.error('Registration failed:', error);
        alert('Registration failed');
      }
    );
  }

  login(user: UserLogIn) {
    this.http.post<any>(this.baseUrl + '/login', user).subscribe(data => {
      if (data.token) {
        alert('Login successful');
        sessionStorage.setItem('token', data.token);
        console.log(data.user.id);
        this.userService.getById(data.user.id);
      }
    },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed');
      }
    );
  }
}
