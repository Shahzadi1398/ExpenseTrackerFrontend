import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignUpService } from 'src/app/shared-services/sign-up.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;
  firstName: any;
  lastName: any;
  loading: boolean = false;
  signUpList: any;
  signUpData: any;

  constructor(private router: Router,
    public signUpService: SignUpService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signUpService.getSignUpData().subscribe((res)=>{
      this.signUpList=res;
    });
  }
  
  showLoadingAndOpenSignup() {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['/signup']);
    }, 2000);
  }

 login(email,password){
    this.signUpService.getSignUpData().subscribe((res) => {
        const signUpList = res;
        const emailExists = signUpList.some((item) => item.email === email);
        if (emailExists) {
            this.signUpService.getSignUpDataByEmailAndPassword(email, password).subscribe(
                (response) => {  
                  this.signUpData= response;
                  this.signUpService.setSignUpData(this.signUpData);              
                  this.loading = true;            
                  this.snackBar.open('Login successful!', 'Ok', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });   
                  setTimeout(() => {
                    this.router.navigate(["/dashboard"]);                    
                  }, 2000)              
                },
                (error) => {
                  this.snackBar.open('Password is wrong', 'Ok', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });  
                }
            );
        } else {
            this.snackBar.open('Email does not exist', 'Ok', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        }
    });
}  

}
