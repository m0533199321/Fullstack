import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { DisplayUsersService } from '../../services/display-users.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-report',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './user-report.component.html',
    styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
    userRegistrationData: { year: number; users: number }[] = []
    maxUsers = 0
  
    constructor(private usersService: DisplayUsersService, private router: Router) {}
    users$: Observable<User[]> = this.usersService.users
  
    ngOnInit(): void {
      this.usersService.getUsers()
      this.usersService.users.subscribe((users: User[]) => {
        const yearCounts: { [key: number]: number } = {}
  
        // Initialize all years with 0
        for (let year = 2020; year <= 2030; year++) {
          yearCounts[year] = 0
        }
  
        // Count users by year
        users.forEach((user: User) => {
          const year_date = new Date(user.createdAt)
          const year = year_date.getFullYear()
          if (year >= 2020 && year <= 2030) {
            yearCounts[year] += 1
          }
        })
  
        this.userRegistrationData = Object.entries(yearCounts).map(([year, count]) => ({
          year: +year,
          users: count,
        }))
  
        // Find maximum users for scaling
        this.maxUsers = Math.max(...this.userRegistrationData.map((data) => data.users), 1)
      })
    }
  
    getYearsRange(start: number, end: number): number[] {
      const years = []
      for (let year = start; year <= end; year++) {
        years.push(year)
      }
      return years
    }
  
    getUsersForYear(year: number): number {
      const data = this.userRegistrationData.find((entry) => entry.year === year)
      return data ? data.users : 0
    }
  
    // Calculate bar height as percentage
    getBarHeight(year: number): number {
      const users = this.getUsersForYear(year)
      return this.maxUsers > 0 ? (users / this.maxUsers) * 100 : 0
    }
  
    // Get total users across all years
    getTotalUsers(): number {
      return this.userRegistrationData.reduce((sum, data) => sum + data.users, 0)
    }
  
    // Get year with maximum users
    getMaxYear(): { year: number; users: number } {
      if (this.userRegistrationData.length === 0) return { year: 0, users: 0 }
  
      return this.userRegistrationData.reduce((max, current) => (current.users > max.users ? current : max), {
        year: 0,
        users: 0,
      })
    }
  
    // Generate Y-axis tick values
    getYAxisTicks(): number[] {
      const tickCount = 5
      const ticks = []
  
      for (let i = tickCount; i >= 0; i--) {
        ticks.push(Math.round((this.maxUsers * i) / tickCount))
      }
  
      return ticks
    }

    getAverageUsers(): number {
        const totalUsers = this.getTotalUsers();
        const totalYears = this.userRegistrationData.length;
        return totalYears > 0 ? parseFloat((totalUsers / totalYears).toFixed(2)) : 0;
    }

    goBack = () => {
      this.router.navigate([-1]);
    }
  }