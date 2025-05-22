import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
    console.log(id);
    this.http.get<User>(`${this.baseUrl}/Full/${id}`).subscribe(data => {
      console.log(data);   
      this.user.next(data as User);
      console.log(this.user.value);
    }
    );
  }

  getUserFromToken() {
    const token = sessionStorage.getItem('token')
    if (token)
      try {
        const decodedToken: any = jwtDecode(token)
        console.log(decodedToken)
        this.getById(decodedToken.id)
        console.log(this.user.value)
      }
      catch (error) {
        console.error('שגיאה בפענוח ה-Token:', error)
      }
  }

  ngOnInit() {
    this.getUserFromToken()
  }

}
