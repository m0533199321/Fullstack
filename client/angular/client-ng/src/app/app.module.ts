import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import { ClientRecipesReportComponent } from './components/client-recipes-report/client-recipes-report.component';

@NgModule({
  declarations: [
    AppComponent,
    UserReportComponent,
    ClientRecipesReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }