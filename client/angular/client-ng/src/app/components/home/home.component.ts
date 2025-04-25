import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  reports = [
    { title: 'User Registration Report', route: '/user-report' },
    { title: 'Client Recipes Report', route: '/client-recipes-report' }
  ];

  constructor(private router: Router) {}

  navigateToReport(route: string): void {
    this.router.navigate([route]);
  }
}
