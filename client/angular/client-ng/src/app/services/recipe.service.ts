import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'https://smartchef-api.onrender.com/api/Recipe'
  public recipe: BehaviorSubject<Recipe> = new BehaviorSubject<Recipe>(new Recipe(0, '', false, 0, new Date(),'','', []));

  constructor(private http: HttpClient) { }

  getFull() {
    return this.http.get<Recipe[]>(`${this.baseUrl}/Full`);
  }

  // getById(id: number) {
  //   console.log(`Fetching recipe with ID: ${id}`);
  //   return this.http.get<Recipe>(`${this.baseUrl}/${id}`).subscribe(data => {
  //     console.log(`Fetched recipe:`, data);
  //     this.recipe.next(data);
  //   });
  // }

  getById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  }  

  deleteImage(id: number) {
    return this.http.delete(`${this.baseUrl}/Image/${id}`)
  }

}
