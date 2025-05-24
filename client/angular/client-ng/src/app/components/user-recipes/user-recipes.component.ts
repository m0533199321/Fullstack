import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRecipesService } from '../../services/user-recipes.service';
import { Recipe, RecipePostModel } from '../../models/recipe.model';
import { User, UserPostModel } from '../../models/user.model';

@Component({
  selector: 'app-user-recipes',
  standalone: true,
  imports: [AsyncPipe, FormsModule, MatSnackBarModule],
  templateUrl: './user-recipes.component.html',
  styleUrl: './user-recipes.component.css'
})
export class UserRecipesComponent implements OnInit {
  userId: number = 0;
  userOfRecipes$: Observable<User> = this.recipesService.userOfRecipes;
  userName: string = '';

  // For inline editing
  editingRecipeId: number | null = null;
  editingRecipeName: string = '';

  // For user name editing
  editingUserName: boolean = false;
  editingFirstName: string = '';
  editingLastName: string = '';

  // Loading states
  loadingRecipeUpdate: number | null = null;
  loadingUserUpdate: boolean = false;
  loadingRecipeDelete: number | null = null;

  // Confirmation dialog
  showConfirmDialog: boolean = false;
  confirmDialogData: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: UserRecipesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.route.data.subscribe(data => {
        if (data['userName']) {
          this.userName = data['userName'];
        }
      });
      this.loadUserRecipes();
    });
  }

  loadUserRecipes(): void {
    this.userOfRecipes$ = this.recipesService.userOfRecipes;
    this.recipesService.getUserRecipes(this.userId);
  }

  goBack(): void {
    this.router.navigate(['-1']);
  }

  // Recipe name editing methods
  startEditingRecipe(recipe: Recipe): void {
    this.editingRecipeId = recipe.id;
    this.editingRecipeName = recipe.title;
  }

  saveRecipeName(recipe: Recipe): void {
    if (this.editingRecipeName.trim() === '') {
      this.snackBar.open('Recipe name cannot be empty', 'Close', {
        duration: 3000
      });
      return;
    }

    if (this.editingRecipeName !== recipe.title) {
      const recipePostModel: RecipePostModel = {
        title: this.editingRecipeName,
        degree: recipe.degree,
        path: recipe.path,
        picture: recipe.picture
      };
      this.recipesService.updateRecipeName(recipe.id, recipePostModel);
    }
    this.cancelEditingRecipe();
  }

  cancelEditingRecipe(): void {
    this.editingRecipeId = null;
    this.editingRecipeName = '';
  }

  // User name editing methods
  startEditingUserName(user: User): void {
    this.editingUserName = true;
    this.editingFirstName = user.fName;
    this.editingLastName = user.lName;
  }

  saveUserName(user: User): void {
    if (this.editingFirstName.trim() === '' || this.editingLastName.trim() === '') {
      this.snackBar.open('First and last name cannot be empty', 'Close', {
        duration: 3000
      });
      return;
    }

    if (this.editingFirstName !== user.fName || this.editingLastName !== user.lName) {
      const userPostModel: UserPostModel = {
        fName: this.editingFirstName,
        lName: this.editingLastName,
        email: user.email,
        password: user.password,
        profile: user.profile
      };
      this.recipesService.updateUserName(user.id, userPostModel);
    }
    this.cancelEditingUserName();
  }

  cancelEditingUserName(): void {
    this.editingUserName = false;
    this.editingFirstName = '';
    this.editingLastName = '';
  }

  // Delete recipe
  // deleteRecipe(recipeId: number): void {
  //   if (confirm('Are you sure you want to delete this recipe?')) {
  //     this.recipesService.deleteRecipe(recipeId)
  //   }
  // }

  // Delete recipe with confirmation
  deleteRecipe(recipe: Recipe): void {
    this.showConfirmationDialog(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      'Delete',
      'Cancel',
      () => this.confirmDeleteRecipe(recipe),
      () => this.hideConfirmationDialog()
    );
  }

  confirmDeleteRecipe(recipe: Recipe): void {
    this.loadingRecipeDelete = recipe.id;
    this.hideConfirmationDialog();

    if (!recipe.isPublic) {
      this.recipesService.deleteRecipe(recipe.id)
    }

    else {
      console.log(`Deleting recipe ${recipe.id} from user ${this.userId}`);  
      this.recipesService.deleteRecipeFromUser(recipe.id, this.userId)
    }
  }
  // Confirmation dialog methods
  showConfirmationDialog(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    onConfirm: () => void,
    onCancel: () => void
  ): void {
    this.confirmDialogData = {
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    };
    this.showConfirmDialog = true;
  }

  hideConfirmationDialog(): void {
    this.showConfirmDialog = false;
    this.confirmDialogData = null;
  }
}