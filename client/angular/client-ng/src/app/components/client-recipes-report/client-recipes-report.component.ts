import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private userService: UserService, private router: Router) { }

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
    this.router.navigate(['-1']);
    // window.history.back();
  }

  // מחשב את נתיב ה-SVG לפלח פאי
  getPieSlicePath(count: number): string {
    const total = this.getTotalClients();
    const value = this.clientsByRecipeCount[count];
    const percentage = value / total;

    // מחשב את הזוויות
    const startAngle = this.getStartAngle(count);
    const endAngle = startAngle + (percentage * 360);

    // מרכז העיגול
    const centerX = 150;
    const centerY = 150;
    const radius = 150;

    // נקודות התחלה וסיום של הקשת
    const startX = centerX + radius * Math.cos(this.toRadians(startAngle));
    const startY = centerY + radius * Math.sin(this.toRadians(startAngle));
    const endX = centerX + radius * Math.cos(this.toRadians(endAngle));
    const endY = centerY + radius * Math.sin(this.toRadians(endAngle));

    // האם הפלח גדול מ-180 מעלות
    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    // יצירת נתיב SVG
    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  }

  // המרה ממעלות לרדיאנים
  toRadians(angle: number): number {
    return angle * Math.PI / 180;
  }

  // מחשב את זווית ההתחלה של כל פלח
  getStartAngle(count: number): number {
    const sortedCounts = this.getSortedRecipeCounts();
    let angle = 0;

    for (let i = 0; i < sortedCounts.indexOf(count); i++) {
      const currentCount = sortedCounts[i];
      const percentage = this.clientsByRecipeCount[currentCount] / this.getTotalClients();
      angle += percentage * 360;
    }

    return angle;
  }

  // מחשב את האחוז של כל קבוצה
  getPercentage(count: number): number {
    const total = this.getTotalClients();
    return Math.round((this.clientsByRecipeCount[count] / total) * 100);
  }

  // מחשב את מיקום הטולטיפ
  getTooltipPosition(count: number): { x: number, y: number } {
    const startAngle = this.getStartAngle(count);
    const percentage = this.clientsByRecipeCount[count] / this.getTotalClients();
    const midAngle = startAngle + (percentage * 360) / 2;

    const radius = 180;
    const centerX = 150;
    const centerY = 150;

    const x = centerX + radius * Math.cos(this.toRadians(midAngle));
    const y = centerY + radius * Math.sin(this.toRadians(midAngle));

    return { x, y };
  }

  // מחשב את מיקום התווית
  getLabelPosition(count: number): { x: number, y: number } {
    const startAngle = this.getStartAngle(count);
    const percentage = this.clientsByRecipeCount[count] / this.getTotalClients();
    const midAngle = startAngle + (percentage * 360) / 2;

    const radius = 200;
    const centerX = 150;
    const centerY = 150;

    const x = centerX + radius * Math.cos(this.toRadians(midAngle)) - 20;
    const y = centerY + radius * Math.sin(this.toRadians(midAngle)) - 20;

    return { x, y };
  }

  // מחשב את נקודת ההתחלה של קו המחבר
  getConnectorStart(count: number): { x: number, y: number } {
    const startAngle = this.getStartAngle(count);
    const percentage = this.clientsByRecipeCount[count] / this.getTotalClients();
    const midAngle = startAngle + (percentage * 360) / 2;

    const radius = 150;
    const centerX = 150;
    const centerY = 150;

    const x = centerX + radius * Math.cos(this.toRadians(midAngle));
    const y = centerY + radius * Math.sin(this.toRadians(midAngle));

    return { x, y };
  }

  // מחשב את אורך קו המחבר
  getConnectorLength(count: number): number {
    return 50; // אורך קבוע או דינמי לפי הצורך
  }

  // מחשב את זווית קו המחבר
  getConnectorAngle(count: number): number {
    const startAngle = this.getStartAngle(count);
    const percentage = this.clientsByRecipeCount[count] / this.getTotalClients();
    const midAngle = startAngle + (percentage * 360) / 2;

    return midAngle;
  }
}