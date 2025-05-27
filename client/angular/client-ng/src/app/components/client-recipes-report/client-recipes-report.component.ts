import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { UserService } from "../../services/user.service"
import { NgxChartsModule, Color, ScaleType } from "@swimlane/ngx-charts";

@Component({
  selector: "app-client-recipes-report",
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: "./client-recipes-report.component.html",
  styleUrls: ["./client-recipes-report.component.css"],
})
export class ClientReportComponent implements OnInit {
  clientsByRecipeCount: { [key: number]: number } = {}
  chartData: any[] = []

  // Chart options
  view: [number, number] = [700, 400]
  gradient = true
  showLegend = true
  showLabels = true
  isDoughnut = false
  legendPosition = "below"

  colorScheme: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#ff6b00", "#ff8c3f", "#ffa76b", "#ffbd8c", "#ffd4b3", "#e05d00", "#b24a00", "#7f3500"],
  };

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.getFull().subscribe((clients) => {
      this.clientsByRecipeCount = clients.reduce(
        (acc, client) => {
          const recipeCount = client.recipesList.length
          if (!acc[recipeCount]) {
            acc[recipeCount] = 0
          }
          acc[recipeCount]++
          return acc
        },
        {} as { [key: number]: number },
      )

      this.prepareChartData()
    })
  }

  prepareChartData(): void {
    this.chartData = Object.entries(this.clientsByRecipeCount)
      .map(([recipeCount, clientCount]) => {
        return {
          name: `${recipeCount} ${+recipeCount === 1 ? "Recipe" : "Recipes"}`,
          value: clientCount,
          extra: {
            percentage: this.getPercentage(+recipeCount),
          },
        }
      })
      .sort((a, b) => {
        // Sort by recipe count (extracting number from name)
        const countA = Number.parseInt(a.name.split(" ")[0])
        const countB = Number.parseInt(b.name.split(" ")[0])
        return countB - countA
      })
  }

  getSortedRecipeCounts(): number[] {
    return Object.keys(this.clientsByRecipeCount)
      .map((key) => +key)
      .sort((a, b) => b - a)
  }

  getTotalClients(): number {
    return Object.values(this.clientsByRecipeCount).reduce((sum, count) => sum + count, 0)
  }

  getMostRecipesCount(): number {
    return this.getSortedRecipeCounts()[0] || 0
  }

  getAverageRecipes(): number {
    const totalRecipes = Object.entries(this.clientsByRecipeCount).reduce(
      (sum, [recipeCount, clientCount]) => sum + +recipeCount * clientCount,
      0,
    )
    const totalClients = this.getTotalClients()
    return totalClients > 0 ? totalRecipes / totalClients : 0
  }

  getPercentage(count: number): number {
    const total = this.getTotalClients()
    return Math.round((this.clientsByRecipeCount[count] / total) * 100)
  }

  onSelect(event: any): void {
    console.log("Item clicked", event)
  }

  goBack = () => {
    this.router.navigate(['-1']);
  }

  // For responsive sizing
  onResize(event: any): void {
    const containerWidth = event.target.innerWidth
    if (containerWidth < 700) {
      this.view = [containerWidth, 300]
    } else {
      this.view = [700, 400]
    }
  }

  // Custom tooltip formatter
  formatTooltipText(data: any): string {
    return `${data.value} clients (${data.extra.percentage}%)`
  }

  toggleDoughnut() {
    this.isDoughnut = !this.isDoughnut;
  }
}

