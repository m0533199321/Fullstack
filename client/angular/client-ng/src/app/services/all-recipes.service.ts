import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable, forkJoin } from "rxjs"
import { map } from "rxjs/operators"
import { RecipePostModel, Recipe, RecipeWithOwner } from "../models/recipe.model"
import { User } from "../models/user.model"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class AllRecipesService {
  private baseUrlRecipe = "https://smartchef-api.onrender.com/api/Recipe"
  private baseUrlUser = "https://smartchef-api.onrender.com/api/User"

  public recipes: BehaviorSubject<RecipeWithOwner[]> = new BehaviorSubject<RecipeWithOwner[]>([])
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient) {}

  getAllRecipesWithOwners(): void {
    this.loading.next(true)

    // Get all recipes and all users, then combine them
    forkJoin({
      recipes: this.http.get<Recipe[]>(this.baseUrlRecipe),
      users: this.http.get<User[]>(this.baseUrlUser),
    })
      .pipe(
        map(({ recipes, users }) => {
          const recipesWithOwners: RecipeWithOwner[] = recipes.map((recipe) => {
            const owner = users.find(
              (user) => user.recipesList && user.recipesList.some((userRecipe) => userRecipe.id === recipe.id),
            )

            return {
              ...recipe,
              ownerName: owner ? `${owner.fName} ${owner.lName}` : undefined,
              ownerId: owner?.id,
            }
          })

          return recipesWithOwners
        }),
      )
      .subscribe({
        next: (recipesWithOwners) => {
          this.recipes.next(recipesWithOwners)
          this.loading.next(false)
        },
        error: (error) => {
          this.loading.next(false)
        },
      })
  }

  getPublicRecipes(): void {
    this.loading.next(true)
    this.http.get<Recipe[]>(`${this.baseUrlRecipe}/Public`).subscribe({
      next: (data) => {
        const publicRecipes: RecipeWithOwner[] = data.map((recipe) => ({ ...recipe }))
        this.recipes.next(publicRecipes)
        this.loading.next(false)
      },
      error: (error) => {
        this.loading.next(false)
      },
    })
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrlRecipe}/${recipeId}`)
  }

  toggleRecipePrivacy(recipeId: number): Observable<any> {
    return this.http.put(`${this.baseUrlRecipe}/PrivateToPublic/${recipeId}`, {})
  }
}
