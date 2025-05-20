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
    { title: 'User Registration Report', route: 'graphs/user-report' },
    { title: 'Client Recipes Report', route: 'graphs/client-recipes-report' },
    { title: 'Recipes Sorted by Comments', route: 'graphs/recipe-report' }
  ];

  constructor(private router: Router) {}

  navigateToReport(route: string): void {
    this.router.navigate([route]);
  }

  goBack = () => {
    console.log('go back');
    this.router.navigate(['-1']);
    // window.history.back();
  }
}
