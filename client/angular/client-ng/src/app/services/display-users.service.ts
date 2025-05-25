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
    console.log(`Deleting user ${userId} and their private recipes`)

    return this.getUserPrivateRecipes(userId).pipe(
      switchMap((privateRecipes) => {
        console.log(`Found ${privateRecipes.length} private recipes for user ${userId}`)

        if (privateRecipes.length === 0) {
          // No private recipes, just delete the user
          return this.deleteUserOnly(userId)
        }

        // Delete all private recipes first
        const deleteRecipeRequests = privateRecipes.map((recipe) =>
          this.deleteRecipe(recipe.id).pipe(
            catchError((error) => {
              console.error(`Failed to delete recipe ${recipe.id}:`, error)
              return of(null) // Continue even if one recipe deletion fails
            }),
          ),
        )

        return forkJoin(deleteRecipeRequests).pipe(
          switchMap(() => {
            console.log("All private recipes deleted, now deleting user")
            return this.deleteUserOnly(userId)
          }),
        )
      }),
      catchError((error) => {
        console.error("Error getting user private recipes:", error)
        // If we can't get recipes, still try to delete the user
        return this.deleteUserOnly(userId)
      }),
      tap(() => {
        console.log(`User ${userId} and their recipes deleted successfully`)
        this.getUsers() // Refresh the users list
      }),
    )
  }

  private deleteUserOnly(userId: number) {
    console.log(`Deleting user ${userId}`)
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
