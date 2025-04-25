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
    { title: 'User Registration Report', route: '/user-report' },
    { title: 'Client Recipes Report', route: '/client-recipes-report' },
    { title: 'Recipes Sorted by Comments', route: '/recipe-report' }
  ];

  constructor(private router: Router) {}

  navigateToReport(route: string): void {
    this.router.navigate([route]);
  }
}
