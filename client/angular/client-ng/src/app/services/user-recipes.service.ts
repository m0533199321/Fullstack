import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserRecipesService {
  // private baseUrl = 'https://smartchef-api.onrender.com/api/Recipe'
  private baseUrl = 'https://smartchef-api.onrender.com/api/User'

  public userOfRecipes: BehaviorSubject<User> = new BehaviorSubject<User>(new User(0, '', '', '', '', '', new Date(), [], []));

  constructor(
    private http: HttpClient
  ) { }

  // getUserRecipes(userId: number) {
  //     this.http.get<Recipe[]>(this.baseUrl+`/Private/${userId}`).subscribe(data => {
  //       console.log(data);
  //       this.recipes.next(data);
  //     })
  //   }

    getUserRecipes(userId: number) {
      this.http.get<User>(this.baseUrl+`/Full/${userId}`).subscribe(data => {
        console.log(data);
        this.userOfRecipes.next(data);
      })
    }

  // getUserRecipes(userId: number) {
  //   return this.http.get<Recipe[]>(`${this.baseUrl}/Private/${userId}`);
  // }
}
