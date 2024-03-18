import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UriService } from './uri.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensecategoryService {

  private GET_EXPENSESCATEGORY_URL = this.uri.BASE_URL + "expensesData/getData";
  private GET_PAYMENTCATEGORY_URL = this.uri.BASE_URL + "expensesData/getPayment";
  private SAVE_EXPENSESCATEGORY_URL = this.uri.BASE_URL + "expensesData/save";
  private DELETE_EXPENSESCATEGORY_URL = this.uri.BASE_URL + "expensesData/delete/";

  constructor(private http: HttpClient,
    private uri: UriService) { }

  
    getExpensesCategoryData(): Observable<any>{
      return this.http.get(this.GET_EXPENSESCATEGORY_URL);
    }   
    
      
    getPaymentCategoryData(): Observable<any>{
      return this.http.get(this.GET_PAYMENTCATEGORY_URL);
    }    

    addExpensesCategoryData(data): Observable<any>{
      return this.http.post(this.SAVE_EXPENSESCATEGORY_URL, data);
    }  

    deleteExpensesCategoryData(uuid): Observable<any>{
      return this.http.delete(this.DELETE_EXPENSESCATEGORY_URL + uuid);
    }  
}

