import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from 'src/app/shared-services/expense.service';
import { ExpensecategoryService } from 'src/app/shared-services/expensecategory.service';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css']
})
export class ManageExpenseComponent implements OnInit {

  update = false;
  expenseName: any;
  amount: any;
  expenseDate:any;
  expenseCategory: any;
  paymentCategory: any;
  expenseComments:any;
  expensesDataList: any;
  paymentDataList: any;
  expenseDataList: any;
  changesMade: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ManageExpenseComponent>,
  private expenseService: ExpenseService,
  private expensesCategoryService:ExpensecategoryService,
  private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.expensesCategoryService.getExpensesCategoryData().subscribe((res) =>{
      this.expensesDataList = res;
    });
  
    this.expensesCategoryService.getPaymentCategoryData().subscribe((res) =>{
      this.paymentDataList = res;
    });
  }

  deleteExpense(uuidId){
    this.expenseService.deleteExpensesDataById(uuidId).subscribe((res) =>{
      this.dialogRef.close();
      this.snackBar.open('Expense has been deleted', 'ok', {
        duration: 2000, 
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.expenseService.notifyExpenseDeleted();
    },
    (error) => {
      console.error('Error deleting expense:', error);
    });  
  }

  reset(){
    this.amount = '';
    this.expenseName = '';
    this.expenseDate = '';
    this.paymentCategory = null;
    this.expenseCategory = null;
    this.expenseComments = '';
  }

  editData(uuidId){
    this.update = true;
    this.expenseService.getExpensesDataById(uuidId).subscribe((res) =>{
      this.expenseDataList = res;
      this.amount = this.expenseDataList.amount;
      this.expenseName = this.expenseDataList.expensesName;
      this.expenseDate = this.expenseDataList.expenseDt;
      this.paymentCategory = this.expenseDataList.paymentCategory;
      this.expenseCategory = this.expenseDataList.expensesCategory;
      this.expenseComments = this.expenseDataList.comment;
    });
  }

  updateData(uuid) {
    const data = {
      expensesName: this.expenseName,
      amount: this.amount,
      expenseDt: this.expenseDate,
      expensesCategory: this.expenseCategory,
      paymentCategory: this.paymentCategory,
      comment: this.expenseComments
    };
    this.expenseService.updateExpensesDataById(uuid,data).subscribe((res) =>{
      this.dialogRef.close();
      this.snackBar.open('Expense has been updated', 'ok', {
        duration: 2000, 
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.expenseService.notifyExpenseDeleted();
    },
    (error) => {
      console.error('Error in updating expense:', error);
    });  
  }
  
}
