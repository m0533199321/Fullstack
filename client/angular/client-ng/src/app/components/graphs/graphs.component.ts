import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graphs',
  imports: [],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.css'
})
export class GraphsComponent {
  reports = [
    {
      title: 'User Registration Report',
      route: 'graphs/user-report',
      description: 'View statistics about user registrations over time.'
    },
    {
      title: 'Client Recipes Report',
      route: 'graphs/client-recipes-report',
      description: 'See detailed analytics about client-submitted recipes.'
    },
    {
      title: 'Recipes Sorted by Comments',
      route: 'graphs/recipe-report',
      description: 'Explore the most discussed recipes based on user comments.'
    }
  ];  

  constructor(private router: Router) {}

  navigateToReport(route: string): void {
    this.router.navigate([route]);
  }

  goBack = () => {
    this.router.navigate(['-1']);
  }
}
