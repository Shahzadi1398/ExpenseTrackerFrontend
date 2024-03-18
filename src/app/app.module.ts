import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './home/login/login.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialAllModule } from './shared-modules/material-all.module';
import { AddhomeComponent } from './home/addhome/addhome.component';
import { ViewexpenseComponent } from './home/viewexpense/viewexpense.component';
import { DatePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ManageExpenseComponent } from './home/manage-expense/manage-expense.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    AddhomeComponent,
    ViewexpenseComponent,
    ManageExpenseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialAllModule,
    NgxChartsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
