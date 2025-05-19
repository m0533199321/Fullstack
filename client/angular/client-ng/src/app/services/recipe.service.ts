import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'https://smartchef-api.onrender.com/api/Recipe'
  public user: BehaviorSubject<Recipe> = new BehaviorSubject<Recipe>(new Recipe(0, '', false, 0, new Date(),'', []));

  constructor(private http: HttpClient) { }

  getFull() {
    return this.http.get<Recipe[]>(`${this.baseUrl}/Full`);
  }

}
