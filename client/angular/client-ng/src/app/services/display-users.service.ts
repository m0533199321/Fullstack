import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DisplayUsersService {

  private baseUrl = 'https://localhost:7005/api/User';

  public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  constructor(private http: HttpClient) { }

  getUsers() {
    this.http.get<User[]>(this.baseUrl).subscribe(data => {
      this.users.next(data);
    })
  }

  deleteUser(userId: number) {
    console.log(`${this.baseUrl}/${userId}`);
    return this.http.delete(`${this.baseUrl}/${userId}`).subscribe(() => {
      this.getUsers();
    }
    );
  }

  addUser(user: User) {
    // return this.http.post<User>(`${this.baseUrl}`, user).subscribe(() => {
    //   this.getUsers();
    // }
    // );
    return this.http.post<User>(`${this.baseUrl}`, user).pipe(
      tap(() => {
        this.getUsers();
      })
    );
  }
}
