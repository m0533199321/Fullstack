import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeWithOwner } from '../../models/recipe.model';
import { map, Observable } from 'rxjs';
import { AllRecipesService } from '../../services/all-recipes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-recipes',
  imports: [AsyncPipe,FormsModule],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.css'
})
export class AllRecipesComponent implements OnInit {
  recipes$: Observable<RecipeWithOwner[]>
  loading$: Observable<boolean>

  searchTerm = ""
  filterType: "all" | "recommended" | "personal" = "all"

  // Loading states
  loadingRecipeDelete: number | null = null

  // Confirmation dialog
  showConfirmDialog = false
  confirmDialogData: {
    title: string
    message: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
    onCancel: () => void
  } | null = null

  constructor(
    private recipesService: AllRecipesService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.recipes$ = this.recipesService.recipes
    this.loading$ = this.recipesService.loading
  }

  ngOnInit(): void {
    this.loadRecipes()
  }

  loadRecipes(): void {
    this.recipesService.getAllRecipesWithOwners()
  }

  get filteredRecipes$(): Observable<RecipeWithOwner[]> {
    return this.recipes$.pipe(
      map((recipes) => {
        let filtered = recipes

        // Filter by search term
        if (this.searchTerm.trim()) {
          const searchLower = this.searchTerm.toLowerCase()
          filtered = filtered.filter(
            (recipe) =>
              recipe.title.toLowerCase().includes(searchLower) ||
              (recipe.ownerName && recipe.ownerName.toLowerCase().includes(searchLower)),
          )
        }

        // Filter by type
        if (this.filterType === "recommended") {
          filtered = filtered.filter((recipe) => recipe.isPublic)
        } else if (this.filterType === "personal") {
          filtered = filtered.filter((recipe) => !recipe.isPublic)
        }

        return filtered
      }),
    )
  }

  onFilterChange(filterType: "all" | "recommended" | "personal"): void {
    this.filterType = filterType
  }

  viewRecipe(recipeId: number): void {
    this.router.navigate(["/recipes", recipeId])
  }

  deleteRecipe(recipe: RecipeWithOwner): void {
    this.showConfirmationDialog(
      "Delete Recipe",
      `Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`,
      "Delete",
      "Cancel",
      () => this.confirmDeleteRecipe(recipe.id),
      () => this.hideConfirmationDialog(),
    )
  }

  confirmDeleteRecipe(recipeId: number): void {
    this.loadingRecipeDelete = recipeId
    this.hideConfirmationDialog()

    this.recipesService.deleteRecipe(recipeId).subscribe({
      next: () => {
        this.loadingRecipeDelete = null
        this.snackBar.open("Recipe deleted successfully!", "Close", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
        })
        this.loadRecipes()
      },
      error: (error) => {
        this.loadingRecipeDelete = null
        console.error("Error deleting recipe:", error)
        this.snackBar.open("Failed to delete recipe.", "Close", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
        })
      },
    })
  }

  togglePrivacy(recipe: RecipeWithOwner): void {
    this.recipesService.toggleRecipePrivacy(recipe.id).subscribe({
      next: () => {
        const newStatus = recipe.isPublic ? "personal" : "recommended"
        this.snackBar.open(`Recipe is now ${newStatus}!`, "Close", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
        })
        this.loadRecipes()
      },
      error: (error) => {
        console.error("Error updating recipe privacy:", error)
        this.snackBar.open("Failed to update recipe privacy.", "Close", {
          duration: 3000,
          verticalPosition: "top",
          horizontalPosition: "center",
        })
      },
    })
  }

  goBack(): void {
    this.router.navigate(["-1"])
  }

  trackByRecipeId(index: number, recipe: RecipeWithOwner): number {
    return recipe.id
  }

  // Confirmation dialog methods
  showConfirmationDialog(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    onConfirm: () => void,
    onCancel: () => void,
  ): void {
    this.confirmDialogData = {
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    }
    this.showConfirmDialog = true
  }

  hideConfirmationDialog(): void {
    this.showConfirmDialog = false
    this.confirmDialogData = null
  }
}
