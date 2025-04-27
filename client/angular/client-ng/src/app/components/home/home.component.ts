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
    { title: 'Display Users', route: '/displayUsers' },
    { title: 'Graphs', route: '/graphs' }
  ];

  currentYear = new Date().getFullYear()

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  user = this.userService.user;

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  login(event: Event): void {
    event.preventDefault()
    this.router.navigate(["/signIn"])
  }

  logout(event: Event): void {
    event.preventDefault()
    // this.authService.logout().then(() => {
    //   this.isAuthenticated = false
    //   this.router.navigate(["/"])
    // })
  }

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }
}
// export class HomeComponent {
//   options = [
//     { title: 'Display Users', route: '/displayUsers' },
//     { title: 'Graphs', route: '/graphs' }
//   ];

//   constructor(private router: Router) {}

//   navigateToRoute(route: string): void {
//     this.router.navigate([route]);
//   }
// }


// export class HomeComponent implements OnInit {
//   isAuthenticated = false
//   userName = ""
//   userEmail = ""
//   userAvatar = "/placeholder.svg?height=100&width=100"
//   currentDate = new Date()
//   currentYear = new Date().getFullYear()

//   totalRecipes = 24
//   newRecipes = 3
//   totalUsers = 1543
//   newUsers = 87
//   totalLikes = 342
//   newLikes = 28

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     // this.authService.isAuthenticated().subscribe((isAuth) => {
//     //   this.isAuthenticated = isAuth

//     //   if (isAuth) {
//     //     this.loadUserData()
//     //   }
//     // })
//   }

//   loadUserData(): void {
//     // this.authService.getCurrentUser().subscribe((user) => {
//     //   if (user) {
//     //     this.userName = user.displayName || "User"
//     //     this.userEmail = user.email || ""
//     //     this.userAvatar = user.photoURL || "/placeholder.svg?height=100&width=100"
//     //   }
//     // })
//   }

//   login(event: Event): void {
//     event.preventDefault()
//     this.router.navigate(["/login"])
//   }

//   register(): void {
//     this.router.navigate(["/register"])
//   }

//   logout(event: Event): void {
//     event.preventDefault()
//     // this.authService.logout().then(() => {
//     //   this.isAuthenticated = false
//     //   this.router.navigate(["/"])
//     // })
//   }

//   learnMore(): void {
//     const featuresSection = document.querySelector(".features")
//     if (featuresSection) {
//       featuresSection.scrollIntoView({ behavior: "smooth" })
//     } else {
//       this.router.navigate(["/recipes"])
//     }
//   }

//   navigateToUserList(): void {
//     this.router.navigate(["/users"])
//   }

//   navigateToGraphs(): void {
//     this.router.navigate(["/graphs"])
//   }

//   navigateToRecipes(): void {
//     this.router.navigate(["/recipes"])
//   }
// }
