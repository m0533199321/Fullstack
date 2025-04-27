import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { UserLogIn, UserRegister } from '../models/auth.model';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7005/api/Auth';

  constructor(private http: HttpClient, private userService: UserService) { }

  login(user: UserLogIn) {
    return this.http.post<any>(this.baseUrl + '/login', user).pipe(
      map(response => {
        console.log(response);
        if (response && response.user.rolesList.length > 0) {
          const hasAdminRole = response.user.rolesList.some((role: { roleName: string; }) => {
            console.log(role.roleName);
            return role.roleName.toLowerCase() === 'admin';
          });

          if (hasAdminRole) {
            sessionStorage.setItem('token', response.token);
            this.userService.getUserFromToken();
            return true;
          } else {
            throw new Error('User does not have admin role');
          }
        } else {
          throw new Error('User does not have admin role');
        }
      }),
      catchError(error => {
        console.error(error);
        return throwError(error);
      })
    );
  }

}
