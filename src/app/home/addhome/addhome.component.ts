import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from 'src/app/shared-services/expense.service';
import { ExpensecategoryService } from 'src/app/shared-services/expensecategory.service';
import { SignUpService } from 'src/app/shared-services/sign-up.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as XLSX from 'xlsx';
import { MatStepper } from '@angular/material/stepper';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-addhome',
  templateUrl: './addhome.component.html',
  styleUrls: ['./addhome.component.css']
})
export class AddhomeComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(MatTable) table: MatTable<any>;
  
  displayedColumns = ['Date', 'Description', 'Amount', 'ExpensesType', 'CategoryType', 'Comments'];
  displayedColumns1 = ['Date', 'Expense Name', 'Amount', 'Expenses Category', 'Payment Type', 'Comments'];
  dataSource = [
    { 
      Date: 'Required format YYYY-MM-DD', 
      'Expense Name': 'Required', 
      Amount: 'Required', 
      'Expenses Category': 'Required for reference see above mention categories', 
      'Payment Type': 'Required (fields can be Credit, Debit, Cash, UPI)', 
      Comments: 'Not Required'
    }
  ];
  dataSource1: MatTableDataSource<any>;
  expenseCount:any;
  email:any;
  firstName: any;
  lastName: any;
  entryDt: any;
  lastLogin: any;
  expensesDataList: any;
  paymentDataList: any;
  expensesName: any;
  expenseName: any;
  amount: any;
  expenseDate:any;
  expenseCategory: any;
  paymentCategory: any;
  expenseComments:any;
  signUpData1:any;
  saveButtonDisabled: boolean = true;
  areButtonsEnabled: boolean = false;
  saveButtonDisabled1: boolean = true;
  areButtonsEnabled1: boolean = false;
  dateError: boolean = false;
  isHome: boolean = false;
  
  constructor(private signUpService: SignUpService,
    private datePipe: DatePipe,
    private expensesCategoryService: ExpensecategoryService,
    private expensesService:ExpenseService,
    private dashboardComponent:DashboardComponent,
    private snackBar:MatSnackBar) { }

  ngOnInit() {    
    this.fetchExpensesData();   
  }

toggleViewExpense() {
  this.isHome = !this.isHome;
}

fetchExpensesData(){
  this.signUpService.getSignUpDataOn().subscribe(data => {
    this.signUpData1=data;
    this.firstName=this.signUpData1[0].firstName;
    this.lastName=this.signUpData1[0].lastName;
    this.entryDt = this.formatDate(this.signUpData1[0].entryDt);
    this.lastLogin= this.formatDate(this.signUpData1[0].lastLogin);   
    this.email = this.signUpData1[0].email;       
    this.expensesService.getExpensesData(this.email).subscribe(data =>{
      this.expenseCount = data;
    });
  }); 

  this.expensesCategoryService.getExpensesCategoryData().subscribe((res) =>{
    this.expensesDataList = res;
  });

  this.expensesCategoryService.getPaymentCategoryData().subscribe((res) =>{
    this.paymentDataList = res;
  });

}

navigateToViewExpenses() {
  this.dashboardComponent.navigateToViewExpenses();
}

formatDate(dateString) {
  if (!dateString) {
    return 'N/A';
  }
  const formattedDate = new Date(dateString);
  return this.datePipe.transform(formattedDate, 'MMM d, yyyy');
}


removeExpenses(expense) {
  this.expensesCategoryService.deleteExpensesCategoryData(expense.expensesName).subscribe((res) => {
    this.snackBar.open('Expense has been deleted', 'ok', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    const index = this.expensesDataList.indexOf(expense);
    if (index !== -1) {
      this.expensesDataList.splice(index, 1);
    }
  });
}

saveExpenses(expensesName) {
  const data = { expensesName };

  this.expensesCategoryService.addExpensesCategoryData(data).subscribe((res: any) => {
    this.snackBar.open('Expense has been saved', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    this.expensesName = '';
    this.saveButtonDisabled = true;
    this.fetchExpensesData();
  }, (error) => {
    console.error('Error saving expense:', error);
  });
}

saveExpenses1(expenseFormRef: NgForm, event: Event) {
  event.preventDefault(); 
  if (expenseFormRef.valid) {
    const formattedDate = this.datePipe.transform(this.expenseDate, 'yyyy-MM-dd');
    const data = {
      expensesName: this.expenseName,
      amount: this.amount,
      expenseDt: formattedDate,
      expensesCategory: this.expenseCategory,
      paymentCategory: this.paymentCategory,
      comment: this.expenseComments,
      signUp: {
        uuidId: this.signUpData1[0].uuidId
      }
    };
    const expensesList = [data]; 

    this.expensesService.addExpensesData(expensesList)
      .subscribe(response => {
        expenseFormRef.resetForm();               
        this.snackBar.open('Expenses have been added', 'ok', {
          duration: 2000, 
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.fetchExpensesData();   
      }, error => {
        console.error('Error saving form data:', error);
      });
  }
}

resetExpenses() {
  this.expensesName = '';
  this.saveButtonDisabled = true;
  this.areButtonsEnabled = false;
}

resetExpenses1() {
  this.expenseName = '';
  this.amount= '';
  this.expenseDate= '';
  this.expenseCategory= '';
  this.paymentCategory= '';
  this.expenseComments= '';
  this.saveButtonDisabled1 = true;
  this.areButtonsEnabled1 = false;
}

onInputChanged() {
    this.saveButtonDisabled = !this.expensesName.trim();
    this.areButtonsEnabled = !this.saveButtonDisabled;
  }

  onInputChanged1() {
    this.saveButtonDisabled1 = 
        !this.expenseName &&
        !this.amount &&
        !this.expenseDate &&
        !this.expenseCategory &&
        !this.paymentCategory &&
        !this.expenseComments;
    this.areButtonsEnabled1 = !this.saveButtonDisabled1;
}

onStep(data) {
}

displayExcelData(data) {
  const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
  const sheetName: string = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (jsonData.length === 0) {
    return;
  }

  const headers: string[] = jsonData.shift() as string[];
  const tableData: any[] = jsonData.map(row => {
    const rowData: any = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });
    return rowData;
  });
  this.dataSource1 = new MatTableDataSource(tableData);
  this.table.renderRows();
}

formatDate1(value: any): string {
  if (!value) return ''; 
  if (typeof value === 'number') {
    const serialDate = value;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const epoch = Date.parse('1900-01-01'); 
    const offset = serialDate - 1;
    const leapYearAdjust = (serialDate > 60) ? 1 : 0;
    const dateMilliseconds = epoch + (offset - leapYearAdjust) * millisecondsPerDay;
    const date = new Date(dateMilliseconds);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    return value;
  }
}

onFileSelected(event) {
  const selectedFile: File = event.target.files[0];
  const fileReader: FileReader = new FileReader();

  fileReader.onload = (e) => {
    const data: any = e.target?.result;
    const arrayBuffer = new Uint8Array(data);
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const headers: string[] = [];
    this.displayExcelData(data);
    for (let cell in worksheet) {
      if (cell !== '!ref' && cell !== '!margins') {
        const cellAddress = XLSX.utils.decode_cell(cell);
        if (cellAddress.r === 0 && worksheet[cell].v !== undefined) {
          headers.push(worksheet[cell].v);
        } else {
          break;
        }
      }
    }    
    const expectedHeaders: string[] = ['Date', 'Expense Name', 'Amount', 'Expenses Category', 'Payment Type', 'Comments'];
    const headersMatch = expectedHeaders.every(header => headers.includes(header));
    if (headersMatch) {
      this.snackBar.open('File uploaded successfully', 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.stepper.next();
    } else {
      this.snackBar.open('Columns are not matching. Please upload a proper file.', 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
    event.target.value = '';
  };

  fileReader.readAsArrayBuffer(selectedFile);
}

uploadData() {
  const formattedData = this.dataSource1.data.map(item => {
    return {
      expensesName: item['Expense Name'],
      amount: item['Amount'],
      expenseDt: this.formatDate1(item['Date']),
      expensesCategory: item['Expenses Category'],
      paymentCategory: item['Payment Type'], 
      comment: item['Comments'],
      signUp: {
        uuidId: this.signUpData1[0].uuidId
      }
    };
  });

  this.expensesService.addExpensesData(formattedData)
    .subscribe(response => {
      this.snackBar.open('Data uploaded successfully', 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.stepper.next(); 
    }, error => {
      console.error('Error uploading data:', error);
      this.snackBar.open('Data is not uploaded', 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
}



}
