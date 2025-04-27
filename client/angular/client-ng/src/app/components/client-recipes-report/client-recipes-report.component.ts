import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-recipes-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-recipes-report.component.html',
  styleUrls: ['./client-recipes-report.component.css']
})

export class ClientReportComponent implements OnInit {
  clientsByRecipeCount: { [key: number]: number } = {};
  maxClientCount = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getFull().subscribe((clients) => {
      this.clientsByRecipeCount = clients.reduce((acc, client) => {
        const recipeCount = client.recipesList.length;
        if (!acc[recipeCount]) {
          acc[recipeCount] = 0;
        }
        acc[recipeCount]++;
        this.maxClientCount = Math.max(this.maxClientCount, acc[recipeCount]);
        return acc;
      }, {} as { [key: number]: number });
    });
  }

  getSortedRecipeCounts(): number[] {
    return Object.keys(this.clientsByRecipeCount)
      .map((key) => +key)
      .sort((a, b) => b - a);
  }

  getBarHeight(recipeCount: number): number {
    if (this.maxClientCount === 0) return 0;
    return (this.clientsByRecipeCount[recipeCount] / this.maxClientCount) * 100;
  }

  getTotalClients(): number {
    return Object.values(this.clientsByRecipeCount).reduce((sum, count) => sum + count, 0);
  }

  getMostRecipesCount(): number {
    return this.getSortedRecipeCounts()[0] || 0;
  }

  getAverageRecipes(): number {
    const totalRecipes = Object.entries(this.clientsByRecipeCount).reduce(
      (sum, [recipeCount, clientCount]) => sum + +recipeCount * clientCount,
      0
    );
    const totalClients = this.getTotalClients();
    return totalClients > 0 ? totalRecipes / totalClients : 0;
  }

  goBack = () => {
    window.history.back();
  }
}