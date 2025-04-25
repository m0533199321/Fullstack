import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-report.component.html',
  styleUrl: './recipe-report.component.css'
})
export class RecipeReportComponent implements OnInit {
  recipesByComments: { [key: number]: Recipe[] } = {}
  maxRecipeCount = 0

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getFull().subscribe((recipes: Recipe[]) => {
      this.recipesByComments = recipes.reduce(
        (acc, recipe) => {
          if (recipe.commentsList == null) {
            recipe.commentsList = []
          }

          const count = recipe.commentsList.length
          if (!acc[count]) {
            acc[count] = []
          }
          acc[count].push(recipe)

          // Update max recipe count for scaling the chart
          if (acc[count].length > this.maxRecipeCount) {
            this.maxRecipeCount = acc[count].length
          }

          return acc
        },
        {} as { [key: number]: Recipe[] },
      )
    })
  }

  getSortedCommentCounts(): number[] {
    return Object.keys(this.recipesByComments)
      .map((key) => +key)
      .sort((a, b) => a - b) // Sort ascending for better visualization
  }

  // Calculate bar height as percentage of max height
  getBarHeight(commentCount: number): number {
    if (this.maxRecipeCount === 0) return 0
    return (this.recipesByComments[commentCount].length / this.maxRecipeCount) * 100
  }

  // Get total number of recipes
  getTotalRecipes(): number {
    let total = 0
    for (const count of this.getSortedCommentCounts()) {
      total += this.recipesByComments[count].length
    }
    return total
  }

  // Get the highest comment count
  getMostCommentedCount(): number {
    const counts = this.getSortedCommentCounts()
    return counts.length > 0 ? counts[counts.length - 1] : 0
  }

  // Calculate average comments per recipe
  getAverageComments(): number {
    let totalComments = 0
    let totalRecipes = 0

    for (const count of this.getSortedCommentCounts()) {
      totalComments += count * this.recipesByComments[count].length
      totalRecipes += this.recipesByComments[count].length
    }

    return totalRecipes > 0 ? totalComments / totalRecipes : 0
  }
}