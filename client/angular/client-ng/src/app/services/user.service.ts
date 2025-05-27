import { Injectable } from '@angular/core';
import { User, UserPostModel } from '../models/user.model';
import { BehaviorSubject, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://smartchef-api.onrender.com/api/User'
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(new User(0, '', '', '', '', '', new Date(), [], []));

  constructor(private http: HttpClient) { }

  getFull() {
    return this.http.get<User[]>(`${this.baseUrl}/Full`);
  }

  getById(id: number) {
    this.http.get<User>(`${this.baseUrl}/Full/${id}`).subscribe(data => {
      this.user.next(data as User);
    }
    );
  }

  getUserFromToken() {
    const token = sessionStorage.getItem('token')
    if (token)
      try {
        const decodedToken: any = jwtDecode(token)
        this.getById(decodedToken.id)
      }
      catch (error) {
        console.error('שגיאה בפענוח ה-Token:', error)
      }
  }

  ngOnInit() {
    this.getUserFromToken()
  }

  updateUserName(userId: number, userPostModel: UserPostModel) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put<User>(
      `${this.baseUrl}/${userId}`,
      userPostModel,
      { headers }
    );
  }

}
