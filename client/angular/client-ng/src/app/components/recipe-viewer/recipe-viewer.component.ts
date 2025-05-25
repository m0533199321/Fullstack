import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { User } from '../../models/user.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as mammoth from 'mammoth';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-recipe-viewer',
  imports: [],
  templateUrl: './recipe-viewer.component.html',
  styleUrl: './recipe-viewer.component.css'
})

export class RecipeViewerComponent implements OnInit {
  @Input() recipe: Recipe | null = null
  @Input() user: User | null = null

  @ViewChild("recipeContent", { static: false }) recipeContent!: ElementRef

  htmlContent: SafeHtml = ""
  direction: "ltr" | "rtl" = "rtl"
  isLoading = true
  isLoadingRecipe = true
  recipeImage = ""
  isImageUploading = false
  error: string | null = null

  recipe$: Observable<Recipe> = this.recipeService.recipe;
  recipeId: number | null = null;


  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private recipeService: RecipeService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.recipeId = +params['recipeId'];
    });
    if (this.recipeId && !this.recipe) {
      console.log("Loading recipe from server...");
      await this.loadRecipeFromServer()
    }
  }

  async loadRecipeFromServer(): Promise<void> {
    this.isLoadingRecipe = true;
    this.isLoading = true;

    try {
      this.recipe = await firstValueFrom(this.recipeService.getById(this.recipeId!));
      this.recipeService.recipe.next(this.recipe); // עדכון ה-BehaviorSubject
      await this.loadRecipeContent();
    } catch (err) {
      console.error("Error loading recipe from server:", err);
      this.error = "שגיאה בטעינת המתכון";
    } finally {
      this.isLoadingRecipe = false;
      this.isLoading = false;
    }
  }

  private async loadRecipeContent(): Promise<void> {

    if (!this.recipe?.path) {
      this.error = "לא נמצא קישור לקובץ המתכון"
      this.isLoading = false
      return
    }

    this.isLoading = true
    try {
      const response = await fetch(this.recipe.path)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()

      const result = await this.convertDocxToHtml(arrayBuffer)

      const enhancedHtml = this.enhanceRecipeContent(result.value)

      this.detectTextDirection(result.value)

      this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(enhancedHtml)
      console.log(this.htmlContent)

      console.log("Recipe content loaded successfully")
    } catch (error) {
      console.error("Error loading recipe content:", error)
      this.error = "שגיאה בטעינת תוכן המתכון"

      await this.loadMockContent()
    } finally {
      this.isLoading = false
    }
  }

  private async convertDocxToHtml(arrayBuffer: ArrayBuffer): Promise<{ value: string }> {
    try {
      // Check if mammoth is available
      if (typeof mammoth !== "undefined") {
        return await mammoth.convertToHtml({ arrayBuffer })
      } else {
        console.warn("Mammoth.js not available, using mock conversion")
        return { value: this.getMockDocxContent() }
      }
    } catch (error) {
      console.error("Error converting docx to html:", error)
      return { value: this.getMockDocxContent() }
    }
  }

  private getMockDocxContent(): string {
    return ""
    // return `
    //   <h1>${this.recipe?.title || "מתכון טעים"}</h1>
    //   <h2>מצרכים</h2>
    //   <ul>
    //     <li>2 כוסות קמח</li>
    //     <li>3 ביצים</li>
    //     <li>1 כוס חלב</li>
    //     <li>2 כפות סוכר</li>
    //     <li>מלח לפי הטעם</li>
    //   </ul>
    //   <h2>אופן הכנה</h2>
    //   <ol>
    //     <li>מערבבים את הקמח עם המלח בקערה גדולה</li>
    //     <li>מוסיפים את הביצים ומערבבים היטב</li>
    //     <li>מוזגים את החלב בהדרגה תוך כדי ערבוב</li>
    //     <li>מחממים מחבת על אש בינונית</li>
    //     <li>מטגנים כל צד למשך 2-3 דקות</li>
    //   </ol>
    //   <p><strong>טיפ:</strong> ניתן להוסיף וניל או קינמון לטעם מיוחד</p>
    // `
  }

  private async loadMockContent(): Promise<void> {
    const mockContent = this.getMockDocxContent()
    const enhancedHtml = this.enhanceRecipeContent(mockContent)
    this.detectTextDirection(mockContent)
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(enhancedHtml)
    
  }

  private detectTextDirection(content: string): void {
    const hebrewWords = content.match(/[א-ת]+/g)
    const hebrewWordCount = hebrewWords ? hebrewWords.length : 0
    this.direction = hebrewWordCount >= 5 ? "rtl" : "ltr"
  }

  private enhanceRecipeContent(html: string): string {
    let enhanced = html
      // Highlight important text
      .replace(/<strong>(.*?)<\/strong>/g, '<span class="highlighted">$1</span>')

      // Enhance headings
      .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="recipe-title"><span class="title-icon">👨‍🍳</span> $1</h1>')
      .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="recipe-section">$1</h2>')
      .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="recipe-subsection">$1</h3>')

      // Enhance lists
      .replace(/<ul>/g, '<ul class="recipe-list">')
      .replace(/<ol>/g, '<ol class="recipe-steps">')

      // Enhance list items with custom bullets and numbering
      .replace(/<li>(.*?)<\/li>/g, (match, content) => {
        // Check if content contains words like "דקות", "שעות", or numbers followed by time units
        const hasTimeReference = /(\d+)\s*(דקות|שעות|minutes|hours)/i.test(content)
        const hasTemperature = /(\d+)\s*(מעלות|°C|°F|degrees)/i.test(content)

        let enhancedContent = content

        // Add special styling for time references
        if (hasTimeReference) {
          enhancedContent = enhancedContent.replace(
            /(\d+)\s*(דקות|שעות|minutes|hours)/gi,
            '<span class="time-highlight">$1 $2</span>',
          )
        }

        // Add special styling for temperature references
        if (hasTemperature) {
          enhancedContent = enhancedContent.replace(
            /(\d+)\s*(מעלות|°C|°F|degrees)/gi,
            '<span class="temp-highlight">$1 $2</span>',
          )
        }

        // Highlight ingredient quantities
        enhancedContent = enhancedContent.replace(
          /(\d+\/?\d*)\s*(כוס|כפית|כפות|גרם|מ"ל|ק"ג|cup|tsp|tbsp|g|ml|kg)/gi,
          '<span class="quantity-highlight">$1 $2</span>',
        )

        return `<li class="recipe-item">${enhancedContent}</li>`
      })

      // Enhance paragraphs
      .replace(/<p>(.*?)<\/p>/g, (match, content) => {
        // Check if paragraph contains cooking tips or notes
        const isTip = /טיפ|עצה|המלצה|tip|note|hint/i.test(content)

        if (isTip) {
          return `<p class="recipe-tip"><span class="tip-icon">💡</span> ${content}</p>`
        }

        return `<p class="recipe-paragraph">${content}</p>`
      })

    // Add section headers if they don't exist
    if (!enhanced.includes("מצרכים") && !enhanced.includes("Ingredients")) {
      const ingredientsHeader = this.direction === "rtl" ? "מצרכים" : "Ingredients"
      enhanced = enhanced.replace(
        /<ul class="recipe-list">/g,
        `<h2 class="recipe-section ingredients-header"><span class="section-icon">🍲</span> ${ingredientsHeader}</h2><ul class="recipe-list">`,
      )
    } else {
      // Add icon to existing ingredients header
      enhanced = enhanced.replace(
        /<h2 class="recipe-section">(מצרכים|Ingredients)<\/h2>/gi,
        '<h2 class="recipe-section ingredients-header"><span class="section-icon">🍲</span> $1</h2>',
      )
    }

    if (!enhanced.includes("אופן הכנה") && !enhanced.includes("Instructions")) {
      const instructionsHeader = this.direction === "rtl" ? "אופן הכנה" : "Instructions"
      enhanced = enhanced.replace(
        /<ol class="recipe-steps">/g,
        `<h2 class="recipe-section instructions-header"><span class="section-icon">📝</span> ${instructionsHeader}</h2><ol class="recipe-steps">`,
      )
    } else {
      // Add icon to existing instructions header
      enhanced = enhanced.replace(
        /<h2 class="recipe-section">(אופן הכנה|Instructions)<\/h2>/gi,
        '<h2 class="recipe-section instructions-header"><span class="section-icon">📝</span> $1</h2>',
      )
    }

    // Add step numbers to ordered list items
    enhanced = enhanced.replace(/<li class="recipe-item">(.*?)<\/li>/g, (match, content) => {
      // Only add step numbers within ordered lists
      if (
        enhanced.lastIndexOf('<ol class="recipe-steps">', enhanced.indexOf(match)) >
        enhanced.lastIndexOf("</ol>", enhanced.indexOf(match))
      ) {
        return `<li class="recipe-item"><span class="step-number"></span>${content}</li>`
      }
      return match
    })

    return enhanced
  }

  onDownloadRecipe(): void {
    if (!this.recipe || !this.recipe.path) {
      console.warn("No recipe or recipe path to download");
      return;
    }

    fetch(this.recipe.path)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // ניקוי שם הקובץ מתווים לא תקינים
        const safeTitle = this.recipe!.title.replace(/[^a-z0-9\u0590-\u05fe\s]/gi, '').trim().replace(/\s+/g, '_');
        a.download = safeTitle + '.docx';

        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        this.error = "שגיאה בהורדת הקובץ";
      });
  }

  onEmailRecipe(recipe: Recipe) {
      const subject = 'מתכון לבדיקה';
      const body = this.emailService.buildRecipeEmailBody(recipe.path);
    
      this.emailService.sendEmail("smartchef12345@gmail.com", subject, body).subscribe({
        next: () => console.log('Email sent successfully'),
        error: err => console.error('Error sending email', err)
      });
    }

  async changeImage(): Promise<void> {
    //   if (!this.recipe) return

    //   this.isImageUploading = true
    //   try {
    //     // Call your image generation service
    //     // const response = await firstValueFrom(
    //       // this.http.post<{ imageUrl: string }>(`${this.apiUrl}/recipes/${this.recipe.id}/generate-image`, {
    //       //   title: this.recipe.title,
    //       // }),
    //     )

    //     if (response.imageUrl) {
    //       // Update recipe image
    //       // await firstValueFrom(
    //       //   this.http.put(`${this.apiUrl}/recipes/${this.recipe.id}/image`, {
    //       //     picture: response.imageUrl,
    //       //   }),
    //       // )

    //       this.recipeImage = response.imageUrl
    //       if (this.recipe) {
    //         this.recipe.picture = response.imageUrl
    //       }

    //       console.log("Image updated successfully")
    //     }
    //   } catch (error) {
    //     console.error("Error updating image:", error)
    //     // Fallback to placeholder
    //     this.recipeImage = "/placeholder.svg?height=250&width=250&text=New+Recipe+Image"
    //   } finally {
    //     this.isImageUploading = false
    //   }
  }

  getStarsArray(): number[] {
    return Array.from({ length: 5 }, (_, i) => i)
  }

  isStarActive(index: number): boolean {
    const degree = this.recipe?.degree || 0
    return index < degree
  }

  retryLoading(): void {
    this.error = null
    this.ngOnInit()
  }

  goBack = () => {
    this.router.navigate(['-1']);
  }
}
