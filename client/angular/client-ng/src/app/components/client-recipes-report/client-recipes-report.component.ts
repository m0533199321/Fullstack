import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-client-recipes-report',
  templateUrl: './client-recipes-report.component.html',
  styleUrls: ['./client-recipes-report.component.css']
})
export class ClientRecipesReportComponent implements OnInit {
  clientRecipesData: { client: string; recipes: number }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getFull().subscribe((users: User[]) => {
      this.clientRecipesData = users.map(user => ({
        client: `${user.fName} ${user.lName}`,
        recipes: user.recipesList ? user.recipesList.length : 0
      }));
    });
  }
}