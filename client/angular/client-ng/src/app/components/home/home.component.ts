import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  options = [
    { 
      title: 'Display Users', 
      route: '/users', 
      description: 'View and manage all registered users in the system.' 
    },
    { 
      title: 'All Recipes', 
      route: '/all-recipes', 
      description: 'Browse through all available recipes and explore new dishes.' 
    },
    { 
      title: 'Global Search', 
      route: '/search', 
      description: 'Search across the entire application for users, recipes, and more.' 
    },
    { 
      title: 'Analytics', 
      route: '/analytics', 
      description: 'View detailed analytics and data visualizations about app usage.' 
    }
  ];  

  particles: {
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
  }[] = [];

  currentYear = new Date().getFullYear()

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  user = this.userService.user;

  ngOnInit(): void {
    this.user = this.userService.user;
    this.generateParticles(20);
  }

  generateParticles(count: number) {
    this.particles = Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 8}s`,
    }));
  }

  login(event: Event): void {
    event.preventDefault()    
    this.router.navigate(["/sign-in"])
  }

  // logout(event: Event): void {
    // event.preventDefault()
  // }

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }
}