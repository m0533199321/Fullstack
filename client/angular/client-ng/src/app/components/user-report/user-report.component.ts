import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { DisplayUsersService } from '../../services/display-users.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-user-report',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './user-report.component.html',
    styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
    userRegistrationData: { year: number; users: number }[] = [];

    constructor(private usersService: DisplayUsersService) { }
    users$: Observable<User[]> = this.usersService.users;

    ngOnInit(): void {
        this.usersService.getUsers();
        this.usersService.users.subscribe((users: User[]) => {
            const yearCounts: { [key: number]: number } = {};
            users.forEach((user: User) => {
                const year_date = new Date(user.createdAt);
                const year = year_date.getFullYear();
                console.log(year);
                if (year >= 2020 && year <= 2030) {
                    yearCounts[year] = (yearCounts[year] || 0) + 1;
                }
            });
            this.userRegistrationData = Object.entries(yearCounts).map(([year, count]) => ({
                year: +year,
                users: count
            }));
        });
    }

    getYearsRange(start: number, end: number): number[] {
        const years = [];
        for (let year = start; year <= end; year++) {
            years.push(year);
        }
        return years;
    }

    getUsersForYear(year: number): number {
        const data = this.userRegistrationData.find(entry => entry.year === year);
        return data ? data.users : 0;
    }
}