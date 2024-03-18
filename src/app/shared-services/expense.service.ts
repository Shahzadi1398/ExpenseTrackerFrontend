import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UriService } from './uri.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private SAVE_EXPENSES_URL = this.uri.BASE_URL + "expenses/save";
  private GET_EXPENSESBYEMAIL_URL = this.uri.BASE_URL + "expenses/get/";
  private GET_EXPENSESDATABYEMAIL_URL = this.uri.BASE_URL + "expenses/get1/";
  private GET_EXPENSESDATABYEMAILBYDATE_URL = this.uri.BASE_URL + "expenses/get2/";
  private GET_EXPENSESDATABYID_URL = this.uri.BASE_URL + "expenses/get3/";
  private GET_EXPENSESDATABYMONTH_URL = this.uri.BASE_URL + "expenses/get4/";
  private GET_EXPENSESDATABYMONTHANDYEAR_URL = this.uri.BASE_URL + "expenses/get5/";
  private DELETE_EXPENSESDATABYID = this.uri.BASE_URL + "expenses/delete/";
  private UPDATE_EXPENSESDATABYID = this.uri.BASE_URL + "expenses/update/";
  private expenseDeletedSource = new Subject<void>();
  
  constructor(private http: HttpClient,
    private uri: UriService) { }

    addExpensesData(data): Observable<any>{
      return this.http.post(this.SAVE_EXPENSES_URL, data);
    }  

    getExpensesData(email): Observable<any>{
      return this.http.get(this.GET_EXPENSESBYEMAIL_URL+email);
    } 

    getExpensesDataById(uuid): Observable<any>{
      return this.http.get(this.GET_EXPENSESDATABYID_URL+uuid);
    } 

    getExpensesDataByEmail(email): Observable<any>{
      return this.http.get(this.GET_EXPENSESDATABYEMAIL_URL+email);
    } 

    getExpensesDataByEmailByDate(email,date): Observable<any>{
      return this.http.get(this.GET_EXPENSESDATABYEMAILBYDATE_URL+email+"/"+date);
    } 

    getExpensesDataByEmailByMonthAndYear(email,month,year): Observable<any>{    
      return this.http.get(this.GET_EXPENSESDATABYMONTHANDYEAR_URL+email+"/"+month+"/"+year);
    } 

    getExpensesDataByEmailByMonth(email): Observable<any>{
      return this.http.get(this.GET_EXPENSESDATABYMONTH_URL+email);
    } 

    deleteExpensesDataById(uuidId): Observable<any>{
      return this.http.delete(this.DELETE_EXPENSESDATABYID+uuidId);
    } 

    updateExpensesDataById(uuidId,data): Observable<any>{
      return this.http.put(this.UPDATE_EXPENSESDATABYID+uuidId,data);
    } 

    expenseDeleted$ = this.expenseDeletedSource.asObservable();

    notifyExpenseDeleted() {
      this.expenseDeletedSource.next();
    }

}
