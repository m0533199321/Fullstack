import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import {} from '@angular/common/http';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { UserService } from '../../services/user.service';
// import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    // imports: [FormsModule, RouterOutlet, RouterLink, MatIconModule, MatToolbarModule, MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDialogModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {

  // constructor(private userService: UserService, private authService: AuthService, public dialog: MatDialog) { }

  // user = this.userService.user;

  // getFromSessionStorage(key: string): string | null {
  //   return sessionStorage.getItem(key);
  // }
}
