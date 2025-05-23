import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRecipesService } from '../../services/user-recipes.service';
import { Recipe } from '../../models/recipe.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-recipes',
  imports: [AsyncPipe],
  templateUrl: './user-recipes.component.html',
  styleUrl: './user-recipes.component.css'
})
export class UserRecipesComponent {
  userId: number = 0;
  // recipes$: Observable<Recipe[]> = this.recipesService.recipes;
  userOfRecipes$: Observable<User> = this.recipesService.userOfRecipes;
  userName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: UserRecipesService,
    // private userService: UserService,
    private snackBar: MatSnackBar
  ) { 
    console.log(this.userOfRecipes$);    
  }

  ngOnInit() {
    this.userOfRecipes$ = this.recipesService.userOfRecipes;
    this.recipesService.getUserRecipes(this.userId);
  }

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.userId = +params['id'];
  //     // this.loadUserRecipes(this.userId);

  //     // Get user name from route data or make another API call if needed
  //     this.route.data.subscribe(data => {
  //       if (data['userName']) {
  //         this.userName = data['userName'];
  //       }
  //     });
  //   });

  //   this.recipes$ = this.recipesService.recipes;
  //   this.recipesService.getUserRecipes(this.userId); 
  // }

  // loadUserRecipes(userId: number): void {
  //   this.recipes$ = this.recipesService.getUserRecipes(userId);

  //   // Handle potential errors
  //   this.recipes$.subscribe({
  //     error: (error) => {
  //       this.snackBar.open('Failed to load recipes. Please try again.', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center'
  //       });
  //     }
  //   });
  // }

  goBack = () => {
    this.router.navigate(['-1']);
  }
}
