import { Component, OnInit, HostListener, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { NgxChartsModule, Color, ScaleType } from "@swimlane/ngx-charts"
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { Recipe } from "../../models/recipe.model"
import { RecipeService } from "../../services/recipe.service"
import { Observable } from "rxjs";

interface ChartData {
  name: string
  value: number
  extra?: {
    count: number
    percentage?: number
  }
}

@Component({
  selector: "app-recipe-report",
  standalone: true,
  imports: [CommonModule, NgxChartsModule, NgxGraphModule],
  templateUrl: "./recipe-report.component.html",
  styleUrl: "./recipe-report.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecipeReportComponent implements OnInit, AfterViewInit {
  recipesByComments: { [key: number]: Recipe[] } = {}
  maxRecipeCount = 0

  // Chart data
  treeMapData: any[] = []
  gaugeData: any[] = []
  bubbleChartData: any[] = []
  forceDirectedData: any = { nodes: [], links: [] }
  

  // Chart options
  view: [number, number] = [700, 400]
  gradient = true
  animations = true

  // Gauge options
  gaugeMin = 0
  gaugeMax = 10
  gaugeUnits = "comments"
  gaugeAngleSpan = 240
  gaugeStartAngle = -120
  gaugeShowAxis = true
  gaugeLargeSegments = 10
  gaugeSmallSegments = 5

  // Color scheme
  colorScheme: Color = {
    name: 'myColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#ff6b00", "#ff8c3f", "#ffa76b", "#ffbd8c", "#ffd4b3", "#e05d00", "#b24a00", "#7f3500"],
  };

  // Active chart type
  activeChart = "gauge"

  constructor(
    private recipeService: RecipeService,
    private router: Router,
  ) {}

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.updateChartDimensions()
  }

  async ngOnInit(): Promise<void> {
    this.updateChartDimensions()

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

      this.prepareChartData()
      console.log("Tree Map Data:", this.treeMapData)
      console.log("Force Directed Data:", this.forceDirectedData)
    })
  }

  ngAfterViewInit(): void {
    // Set up tab switching after view is initialized
    setTimeout(() => {
      this.setupTabSwitching()
    }, 500)
  }

  setupTabSwitching(): void {
    const tabButtons = document.querySelectorAll(".tab-button")

    tabButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.currentTarget as HTMLElement
        const chartType = target.getAttribute("data-chart")

        if (chartType) {
          this.setActiveChart(chartType)
        }
      })
    })
  }

  updateChartDimensions() {
    const width = window.innerWidth
    if (width < 500) {
      this.view = [width - 50, 300]
    } else if (width < 768) {
      this.view = [width - 100, 350]
    } else {
      this.view = [700, 400]
    }
  }

  prepareChartData() {
    // Prepare TreeMap data - FIXED FORMAT
    const singleTreeMapData = {
      name: "Recipe Comments",
      value: this.getTotalRecipes(),
      children: this.getSortedCommentCounts().map((count) => {
        return {
          name: `${count} ${count === 1 ? "Comment" : "Comments"}`,
          value: this.recipesByComments[count].length,
        }
      }),
    }

    this.treeMapData = [singleTreeMapData]

    // Prepare Gauge data
    this.gaugeData = [
      {
        name: "Average Comments",
        value: this.getAverageComments(),
      },
    ]

    // Set gauge max to the highest comment count + 1 for better visualization
    this.gaugeMax = this.getMostCommentedCount() + 1

    // Prepare Bubble Chart data - simplified structure
    this.bubbleChartData = []

    // Create a single series for bubble chart
    const series: any[] = []

    this.getSortedCommentCounts().forEach((count) => {
      const recipesWithCount = this.recipesByComments[count]

      // Add a bubble for each comment count
      series.push({
        name: `${count} ${count === 1 ? "Comment" : "Comments"}`,
        x: count,
        y: recipesWithCount.length,
        r: recipesWithCount.length * 5 + 10, // Radius based on number of recipes
      })
    })

    this.bubbleChartData = [
      {
        name: "Recipes by Comment Count",
        series: series,
      },
    ]

    // Prepare Force Directed Graph data
    const nodes: any[] = []
    const links: any[] = []

    // Create a central node
    nodes.push({
      id: "recipes",
      label: "Recipes",
      value: this.getTotalRecipes(),
    })

    // Create nodes for each comment count
    this.getSortedCommentCounts().forEach((count) => {
      const recipesWithCount = this.recipesByComments[count]
      const nodeId = `comments-${count}`

      nodes.push({
        id: nodeId,
        label: `${count} ${count === 1 ? "Comment" : "Comments"}`,
        value: recipesWithCount.length,
      })

      // Link to central node
      links.push({
        source: "recipes",
        target: nodeId,
        value: recipesWithCount.length,
      })

      // Create nodes for each recipe with this comment count
      recipesWithCount.forEach((recipe) => {
        const recipeNodeId = `recipe-${recipe.id}`

        // Only add recipe nodes for recipes with comments
        if (count > 0) {
          nodes.push({
            id: recipeNodeId,
            label: recipe.title,
            value: 1,
          })

          // Link recipe to its comment count
          links.push({
            source: nodeId,
            target: recipeNodeId,
            value: 1,
          })
        }
      })
    })

    this.forceDirectedData = {
      nodes: nodes,
      links: links,
    }
  }

  getSortedCommentCounts(): number[] {
    return Object.keys(this.recipesByComments)
      .map((key) => +key)
      .sort((a, b) => a - b) // Sort ascending for better visualization
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

  // Calculate percentage of recipes with this comment count
  getPercentage(count: number): number {
    const total = this.getTotalRecipes()
    return total > 0 ? Math.round((this.recipesByComments[count].length / total) * 100) : 0
  }

  goBack(): void {
    this.router.navigate(["-1"])
  }

  onSelect(event: any): void {
    console.log("Item clicked", event)
  }

  setActiveChart(chartType: string): void {
    console.log("Setting active chart to:", chartType)
    this.activeChart = chartType

    // Remove active class from all buttons
    const buttons = document.querySelectorAll(".tab-button")
    buttons.forEach((button) => button.classList.remove("active"))

    // Add active class to selected button
    const activeButton = document.querySelector(`[data-chart="${chartType}"]`)
    if (activeButton) {
      activeButton.classList.add("active")
    }
  }
}
