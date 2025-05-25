import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { GlobalSearchService, SearchResult } from '../../services/global-search.service';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllRecipesService } from '../../services/all-recipes.service';
import { DisplayUsersService } from '../../services/display-users.service';

interface ConfirmDialogData {
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @ViewChild("searchInput") searchInput!: ElementRef

  searchResults$: Observable<SearchResult[]>
  loading$: Observable<boolean>

  searchTerm = ""
  filterType: "all" | "users" | "recipes" = "all"

  // Loading states
  loadingRecipeDelete: number | null = null
  loadingUserDelete: number | null = null

  // Confirmation dialog
  showConfirmDialog = false
  confirmDialogData: ConfirmDialogData | null = null

  private searchSubject = new Subject<string>()

  constructor(
    private searchService: GlobalSearchService,
    private allRecipesService: AllRecipesService,
    private displayUsersService: DisplayUsersService,
    private router: Router,
  ) {
    this.searchResults$ = this.searchService.searchResults
    this.loading$ = this.searchService.loading
  }

  ngOnInit(): void {
    // Setup debounced search
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only search if the term actually changed
      )
      .subscribe((searchTerm) => {
        this.searchService.searchAll(searchTerm)
      })
  }

  ngAfterViewInit(): void {
    // Focus on search input when component loads
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    }, 100)
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm)
  }

  clearSearch(): void {
    this.searchTerm = ""
    this.searchService.clearSearch()
    this.searchInput.nativeElement.focus()
  }

  get filteredResults$(): Observable<SearchResult[]> {
    return this.searchResults$.pipe(
      map((results) => {
        if (this.filterType === "all") {
          return results
        } else if (this.filterType === "users") {
          return results.filter((result) => result.type === "user")
        } else if (this.filterType === "recipes") {
          return results.filter((result) => result.type === "recipe")
        }
        return results
      }),
    )
  }

  onFilterChange(filterType: "all" | "users" | "recipes"): void {
    this.filterType = filterType
  }

  getFilteredCount(filterType: "all" | "users" | "recipes"): number {
    const results = this.searchService.searchResults.value
    if (filterType === "all") {
      return results.length
    } else if (filterType === "users") {
      return results.filter((result) => result.type === "user").length
    } else if (filterType === "recipes") {
      return results.filter((result) => result.type === "recipe").length
    }
    return 0
  }

  // Recipe actions
  viewRecipe(recipeId: number): void {
    this.router.navigate(["/recipe", recipeId]);
  }

  deleteRecipe(recipe: SearchResult): void {
    this.showConfirmDialog = true
    this.confirmDialogData = {
      title: "Delete Recipe",
      message: `Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        this.confirmDeleteRecipe(recipe.id)
        this.hideConfirmDialog()
      },
      onCancel: () => {
        this.hideConfirmDialog()
      },
    }
  }

  private confirmDeleteRecipe(recipeId: number): void {
    this.loadingRecipeDelete = recipeId
    this.allRecipesService.deleteRecipe(recipeId).subscribe({
      next: () => {
        console.log("Recipe deleted successfully")
        this.loadingRecipeDelete = null
        // Refresh search results
        if (this.searchTerm) {
          this.searchService.searchAll(this.searchTerm)
        }
      },
      error: (error) => {
        console.error("Error deleting recipe:", error)
        this.loadingRecipeDelete = null
      },
    })
  }

  toggleRecipePrivacy(recipe: SearchResult): void {
    this.allRecipesService.toggleRecipePrivacy(recipe.id).subscribe({
      next: () => {
        console.log("Recipe privacy toggled successfully")
        // Refresh search results
        if (this.searchTerm) {
          this.searchService.searchAll(this.searchTerm)
        }
      },
      error: (error) => {
        console.error("Error toggling recipe privacy:", error)
      },
    })
  }

  // User actions
  viewUser(userId: number): void {
    this.router.navigate(["/users", userId])
  }

  viewUserRecipes(userId: number): void {
    this.router.navigate(["/users", userId, "recipes"])
  }

  deleteUser(user: SearchResult): void {
    this.showConfirmDialog = true
    this.confirmDialogData = {
      title: "Delete User",
      message: `Are you sure you want to delete "${user.title}" and all their private recipes? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => {
        this.confirmDeleteUser(user.id)
        this.hideConfirmDialog()
      },
      onCancel: () => {
        this.hideConfirmDialog()
      },
    }
  }

  private confirmDeleteUser(userId: number): void {
    this.loadingUserDelete = userId
    this.displayUsersService.deleteUserWithRecipes(userId).subscribe({
      next: () => {
        console.log("User deleted successfully")
        this.loadingUserDelete = null
        // Refresh search results
        if (this.searchTerm) {
          this.searchService.searchAll(this.searchTerm)
        }
      },
      error: (error) => {
        console.error("Error deleting user:", error)
        this.loadingUserDelete = null
      },
    })
  }

  private hideConfirmDialog(): void {
    this.showConfirmDialog = false
    this.confirmDialogData = null
  }

  goBack(): void {
    this.router.navigate(["-1"])
  }
}
