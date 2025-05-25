import { Injectable } from "@angular/core"
import { BehaviorSubject, forkJoin, of } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"
import type { User } from "../models/user.model"
import type { Recipe } from "../models/recipe.model"
import { HttpClient } from "@angular/common/http"

export interface SearchResult {
  type: "user" | "recipe"
  id: number
  title: string
  subtitle: string
  description?: string
  image?: string
  userId?: number
  userName?: string
  isPublic?: boolean
  degree?: number
  createdAt?: Date
  recipesList?: Recipe[];
}

@Injectable({
  providedIn: "root",
})
export class GlobalSearchService {
  private baseUrlUser = "https://smartchef-api.onrender.com/api/User"
  private baseUrlRecipe = "https://smartchef-api.onrender.com/api/Recipe"

  public searchResults: BehaviorSubject<SearchResult[]> = new BehaviorSubject<SearchResult[]>([])
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient) {}

  searchAll(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.searchResults.next([])
      return
    }

    this.loading.next(true)
     // Get all users and all recipes, then search through them
    forkJoin({
      users: this.http.get<User[]>(this.baseUrlUser+'/Full'),
      recipes: this.http.get<Recipe[]>(this.baseUrlRecipe+'/Full'),
    })
      .pipe( 
        tap(data => console.log('Raw data from forkJoin:', data)),
        catchError(error => {
          console.error('Caught error in forkJoin:', error)
          this.loading.next(false)
          return of({ users: [], recipes: [] }) // תחזיר משהו ריק כדי שהפייפ ימשיך
        }),
        map(({ users, recipes }) => {
          const results: SearchResult[] = []
          const searchLower = searchTerm.toLowerCase()

          // Search in users
          users.forEach((user) => {
            
            const fullName = `${user.fName} ${user.lName}`.toLowerCase()
            const email = user.email.toLowerCase()

            if (fullName.includes(searchLower) || email.includes(searchLower)) {
              results.push({
                type: "user",
                id: user.id,
                title: `${user.fName} ${user.lName}`,
                subtitle: user.email,
                description: `${user.recipesList?.length || 0} recipes`,
                image: user.profile,
                createdAt: user.createdAt,
                recipesList: user.recipesList || [],
              })
            }
            

            // Search in user's recipes
            if (user.recipesList) {
              user.recipesList.forEach((recipe) => {
                if (recipe.title.toLowerCase().includes(searchLower)) {
                  results.push({
                    type: "recipe",
                    id: recipe.id,
                    title: recipe.title,
                    subtitle: `By ${user.fName} ${user.lName}`,
                    description: recipe.isPublic ? "Public recipe" : "Private recipe",
                    image: recipe.picture,
                    userId: user.id,
                    userName: `${user.fName} ${user.lName}`,
                    isPublic: recipe.isPublic,
                    degree: recipe.degree,
                    createdAt: recipe.createdAt,
                  })
                }
              })
            }
          })

          // Search in all recipes (for recipes not associated with users)
          recipes.forEach((recipe) => {
            if (recipe.title.toLowerCase().includes(searchLower)) {
              // Check if this recipe is already added from user's recipes
              const existingRecipe = results.find((r) => r.type === "recipe" && r.id === recipe.id)
              if (!existingRecipe) {
                results.push({
                  type: "recipe",
                  id: recipe.id,
                  title: recipe.title,
                  subtitle: "System recipe",
                  description: recipe.isPublic ? "Public recipe" : "Private recipe",
                  image: recipe.picture,
                  isPublic: recipe.isPublic,
                  degree: recipe.degree,
                  createdAt: recipe.createdAt,
                })
              }
            }
          })

          // Sort results: users first, then recipes, then by relevance
          return results.sort((a, b) => {
            if (a.type !== b.type) {
              return a.type === "user" ? -1 : 1
            }
            return a.title.localeCompare(b.title)
          })
        }),
      )
      .subscribe({
        next: (results) => {
          console.log("Search results:", results)
          this.searchResults.next(results)
          this.loading.next(false)
        },
        error: (error) => {
          console.error("Error searching:", error)
          this.loading.next(false)
        },
      })
  }

  clearSearch(): void {
    this.searchResults.next([])
  }
}
