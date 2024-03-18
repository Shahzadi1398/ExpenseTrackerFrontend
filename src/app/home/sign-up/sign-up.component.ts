import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignUpService } from 'src/app/shared-services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  email: any;
  password: any;
  firstName: any;
  lastName: any;
  isSubmitting: boolean = false;
  loading: boolean = false;
  signUpList: any;

  constructor(
    public signUpService: SignUpService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signUpService.getSignUpData().subscribe((res)=>{
      this.signUpList=res;
    });
  }

  signup(signupForm: NgForm) {
    if (signupForm.valid && !this.isSubmitting) {
        const emailExists = this.signUpList.some(item => item.email === this.email);
        
        if (emailExists) {
            this.snackBar.open('Email is already registered', 'ok', {
                duration: 3000,
                verticalPosition: 'top'
            });
            signupForm.resetForm();
            return; 
        }

        this.isSubmitting = true;

        const formData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };

        this.signUpService.addSignUpData(formData)
            .subscribe(response => {
                signupForm.resetForm();
                this.isSubmitting = false;
                this.snackBar.open('Your ID has been registered', 'ok', {
                    duration: 3000, 
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }, error => {
                console.error('Error saving form data:', error);
                this.isSubmitting = false;
            });
    }
}



showLoadingAndOpenSignup(){
  this.loading = true;
  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 2000);
}


}
