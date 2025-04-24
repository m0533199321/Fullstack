import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { UserLogIn, UserRegister } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7005/api/Auth';

  constructor(private http: HttpClient, private userService: UserService) { }

  login(user: UserLogIn) {
    this.http.post<any>(this.baseUrl + '/login', user).subscribe(data => {
      if (data.token) {

        console.log(data.user.rolesList);
        
        if (data.user.rolesList && data.user.rolesList.some((r: any) => r.roleName.toLowerCase() === 'admin')) {
          alert('Login successful');
          sessionStorage.setItem('token', data.token);
          console.log(data.user.id);
          this.userService.getById(data.user.id);
        } else {
          alert('Login failed: You do not have admin privileges.');
        }
      } else {
        alert(data.error || 'Login failed');
      }
    },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed');
      });
  }

}
