import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UriService } from './uri.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private SAVE_SINGUP_URL = this.uri.BASE_URL + "signUp/save";
  private GET_SINGUP_URL = this.uri.BASE_URL + "signUp/getData";
  private GET_SINGUPBYEMAILANDPASSWORD_URL = this.uri.BASE_URL + "signUp/get/";
  private UPDATE_SINGUPBYEMAILANDPASSWORD_URL = this.uri.BASE_URL + "signUp/update/";

  private signUpDataSubject = new BehaviorSubject<any>(null);
  signUpData$ = this.signUpDataSubject.asObservable();
  
  constructor(private http: HttpClient,
    private uri: UriService) { 
      const storedData = localStorage.getItem('signUpData');
      if (storedData) {
        this.signUpDataSubject.next(JSON.parse(storedData));
      }
    }

    addSignUpData(data): Observable<any>{
      return this.http.post(this.SAVE_SINGUP_URL, data);
    }  
  
    getSignUpData(): Observable<any>{
      return this.http.get(this.GET_SINGUP_URL);
    }  
  
    getSignUpDataByEmailAndPassword(email,password): Observable<any>{
      return this.http.get(this.GET_SINGUPBYEMAILANDPASSWORD_URL + email +"/" + password);
    } 

    updateSignUpDataByEmailAndPassword(email,password,data): Observable<any>{
      return this.http.put(this.UPDATE_SINGUPBYEMAILANDPASSWORD_URL + email +"/" + password,data);
    } 

    setSignUpData(data: any) {
      localStorage.setItem('signUpData', JSON.stringify(data));
      this.signUpDataSubject.next(data);
    }
  
    getSignUpDataOn(): Observable<any> {
      return this.signUpData$;
    }
    
}
