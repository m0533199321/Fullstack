import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DisplayUsersService {

  private baseUrl = 'https://smartchef-api.onrender.com/api/User';
  private baseUrlRecipe = 'https://smartchef-api.onrender.com/api/Recipe';

  public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  constructor(private http: HttpClient) { }

  getUsers() {
    this.http.get<User[]>(this.baseUrl+`/Full`).subscribe(data => {
      this.users.next(data);
    })
  }

  getUserPrivateRecipes(userId: number) {
    return this.http.get<Recipe[]>(`${this.baseUrl}/Private/${userId}`)
  }

  deleteRecipe(recipeId: number) {
    return this.http.delete(`${this.baseUrlRecipe}/${recipeId}`)
  }

  deleteUserWithRecipes(userId: number) {

    return this.getUserPrivateRecipes(userId).pipe(
      switchMap((privateRecipes) => {
        if (privateRecipes.length === 0) {
          return this.deleteUserOnly(userId)
        }

        const deleteRecipeRequests = privateRecipes.map((recipe) =>
          this.deleteRecipe(recipe.id).pipe(
            catchError((error) => {
              return of(null)
            }),
          ),
        )

        return forkJoin(deleteRecipeRequests).pipe(
          switchMap(() => {
            return this.deleteUserOnly(userId)
          }),
        )
      }),
      catchError((error) => {
        return this.deleteUserOnly(userId)
      }),
      tap(() => {
        this.getUsers()
      }),
    )
  }

  private deleteUserOnly(userId: number) {
    return this.http.delete(`${this.baseUrl}/${userId}`)
  }

  // Keep the original method for backward compatibility
  deleteUser(userId: number) {
    return this.deleteUserWithRecipes(userId).subscribe()
  }

  // deleteUser(userId: number) {
  //   console.log(`${this.baseUrl}/${userId}`);
  //   return this.http.delete(`${this.baseUrl}/${userId}`).subscribe(() => {
  //     this.getUsers();
  //   }
  //   );
  // }

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
