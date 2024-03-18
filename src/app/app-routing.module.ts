import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';
import { AddhomeComponent } from './home/addhome/addhome.component';
import { ViewexpenseComponent } from './home/viewexpense/viewexpense.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:"login", component:LoginComponent},
  {path:"signup", component:SignUpComponent},
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: '', redirectTo: 'viewexpense', pathMatch: 'full' },
    { path: 'viewexpense', component: ViewexpenseComponent },
    { path: 'home', component: AddhomeComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
