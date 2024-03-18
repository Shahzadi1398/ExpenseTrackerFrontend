import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { SignUpService } from 'src/app/shared-services/sign-up.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isHome: boolean = false;
  signUpData: any;
  password: any;
  email: any;

  constructor(private router: Router,
    private signUpService: SignUpService,
    private snackBar: MatSnackBar) {}
   

  ngOnInit(): void {
    
  }

  toggleHomeIcon(){
    this.isHome = !this.isHome;
    if (this.isHome) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.router.navigate(['/dashboard/viewexpense']);
    }
  }
  
  navigateToViewExpenses(){
    this.isHome = false;
    this.router.navigate(['/dashboard/viewexpense']);
  }

  navigateToHome() {
    this.isHome = true;
    this.router.navigate(['/dashboard/home']);
  }

  logout() {
    this.signUpService.getSignUpDataOn().subscribe(data => {
      this.signUpData = data; 
      this.email = this.signUpData[0].email;
      this.password = this.signUpData[0].password;       
      this.signUpService.updateSignUpDataByEmailAndPassword(this.email, this.password, null).subscribe(data => {
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);       
      });
    });    
  }
  

}
