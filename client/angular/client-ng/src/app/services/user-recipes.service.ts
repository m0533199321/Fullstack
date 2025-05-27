import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe, RecipePostModel } from '../models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { User, UserPostModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserRecipesService {
  private baseUrlRecipe = 'https://smartchef-api.onrender.com/api/Recipe'
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
    this.http.get<User>(this.baseUrl + `/Full/${userId}`).subscribe(data => {
      this.userOfRecipes.next(data as User)
    })
  }

  updateRecipeName(recipeId: number, recipePostModel: RecipePostModel) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put<Recipe>(
      `${this.baseUrlRecipe}/${recipeId}`,
      recipePostModel,
      { headers }
    ).subscribe(() => {
      this.getUserRecipes(this.userOfRecipes.value.id);
    });
  }

  updateUserName(userId: number, userPostModel: UserPostModel) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.put<User>(
        `${this.baseUrl}/${userId}`,
        userPostModel,
        { headers }
      ).subscribe(() => {
        this.getUserRecipes(this.userOfRecipes.value.id);
      });
    }

  deleteRecipe(recipeId: number) {
    return this.http.delete(`${this.baseUrlRecipe}/${recipeId}`).subscribe(() => {
      this.getUserRecipes(this.userOfRecipes.value.id);
    }
    );
  }

  deleteRecipeFromUser(recipeId: number, userId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.delete<boolean>(
      `${this.baseUrlRecipe}/RecipeFromUser/${recipeId}/${userId}`,
      { headers }
    ).subscribe(() => {
      this.getUserRecipes(userId);
    });
  }

  // getUserRecipes(userId: number) {
  //   return this.http.get<Recipe[]>(`${this.baseUrl}/Private/${userId}`);
  // }
}
