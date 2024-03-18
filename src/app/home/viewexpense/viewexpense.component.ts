import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ExpenseService } from 'src/app/shared-services/expense.service';
import { SignUpService } from 'src/app/shared-services/sign-up.service';
import Drilldown from 'highcharts/modules/drilldown';
import 'highcharts/modules/heatmap';
import { ExpensecategoryService } from 'src/app/shared-services/expensecategory.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageExpenseComponent } from '../manage-expense/manage-expense.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import * as XLSX from 'xlsx';
Drilldown(Highcharts);

@Component({
  selector: 'app-viewexpense',
  templateUrl: './viewexpense.component.html',
  styleUrls: ['./viewexpense.component.css']
})
export class ViewexpenseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayColumns: string[] = 
  ['expensesName', 
  'amount', 
  'expenseDt', 
  'expensesCategory', 
  'paymentCategory'
  ]

  expensesData = new MatTableDataSource<any>();
  signUpData1:any;
  email:any;
  expenseDataList: any;
  expenseDataList1: any;
  metrics: any;
  selectedDate: any;
  paymentDataList: any;
  expensesCategoryList: any;
  selectedMonth: any;
  selectedYear: any;
  showNoDataMessage:boolean = false;
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];
  years = [];

  constructor(private expensesService:ExpenseService,
    private signUpService: SignUpService,
    private expensesCategoryService: ExpensecategoryService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private dashboardComponent:DashboardComponent) { 
      const currentYear = new Date().getFullYear();
      for (let i = currentYear - 15; i <= currentYear; i++) {
        this.years.push(i);
      }
      this.selectedMonth = new Date().getMonth() + 1; 
      this.selectedYear = currentYear; 

    }

  ngOnInit(): void {   
    this.expensesCategoryService.getPaymentCategoryData().subscribe((res) =>{
      this.paymentDataList = res;
      this.getExpensesDataByEmail();     
    });
    this.expensesCategoryService.getExpensesCategoryData().subscribe((res) =>{
      this.expensesCategoryList = res;
      this.getExpensesDataByEmail();    
    });
    this.expensesService.expenseDeleted$.subscribe(() => {
      this.getExpensesDataByEmail();
    });
  }

  exportToExcel(): void {
    const tableData = this.expensesData.filteredData || this.expensesData.data;
    const displayedColumns = this.displayColumns;
    const filteredData = tableData.map(row => {
        const filteredRow = {};
        displayedColumns.forEach(column => {
            filteredRow[column] = row[column];
        });
        return filteredRow;
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Expenses.xlsx');
}


  getExpensesDataByEmail() {
    this.signUpService.getSignUpDataOn().subscribe(data => {
      this.signUpData1 = data;
      this.email = this.signUpData1[0].email;

      this.expensesService.getExpensesDataByEmail(this.email).subscribe(expenseDataList => {
        this.expenseDataList = expenseDataList;
        this.expensesData = new MatTableDataSource<any>(this.expenseDataList);
        if (this.paginator) {
          this.expensesData.paginator = this.paginator;
          this.paginator.pageSize = 5; 
        }
        this.expensesData.sort = this.sort;
        let numOfEntries = this.expenseDataList.length;
        let totalAmount = 0;
        let firstExpenseDate: Date;
        let lastExpenseDate: Date;
        this.expenseDataList.forEach(expense => {
          totalAmount += expense.amount;
          const expenseDate = new Date(expense.expenseDt);
          if (!firstExpenseDate || expenseDate < firstExpenseDate) {
            firstExpenseDate = expenseDate;
          }
          if (!lastExpenseDate || expenseDate > lastExpenseDate) {
            lastExpenseDate = expenseDate;
          }
        });

        const formattedFirstExpenseDate = this.datePipe.transform(firstExpenseDate, 'MMM dd yyyy');
        const formattedLastExpenseDate = this.datePipe.transform(lastExpenseDate, 'MMM dd yyyy');

        this.metrics = [
          { color: null, value: formattedFirstExpenseDate, metricTitle: 'First Expense Date', icon: 'today' },
          { color: null, value: formattedLastExpenseDate, metricTitle: 'Latest Expense Date', icon: 'today' },
          { color: null, value: numOfEntries, metricTitle: 'Number of Expenses', icon: 'receipt' },
          { color: 'money-icon', value: totalAmount, metricTitle: 'Total Amount', icon: '₹' },
        ];

        this.expensesService.getExpensesDataByEmailByMonth(this.email).subscribe(res =>{
          this.expenseDataList1 = res;
          this.barChartGraph(this.expenseDataList1);
        });
        this.pieChartGraph(this.expenseDataList);
        this.columnChartGraph(this.expenseDataList,null);
        this.lineChartGraph(this.expenseDataList,null);    
        if (numOfEntries === 0) {
          this.showNoDataMessage = true;
        } else {
          this.showNoDataMessage = false;
        } 
      });
    });
  }

  search(selectedDate){
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
  
    this.signUpService.getSignUpDataOn().subscribe(data => {
      this.signUpData1 = data;
      this.email = this.signUpData1[0].email;
      this.expensesService.getExpensesDataByEmailByDate(this.email, formattedDate).subscribe(expenseDataList => {
        this.expenseDataList = expenseDataList;    
        this.showNoDataMessage=false;
        this.columnChartGraph(expenseDataList, selectedDate);
        this.lineChartGraph(expenseDataList, selectedDate);
      });     
    });
  }
  
  search1() {
    this.signUpService.getSignUpDataOn().subscribe(data => {
      this.signUpData1 = data;
      this.email = this.signUpData1[0].email;
      this.expensesService.getExpensesDataByEmailByMonthAndYear(this.email, this.selectedMonth, this.selectedYear)
        .subscribe(expenseDataList => {
          this.expenseDataList = expenseDataList; 
          this.showNoDataMessage=false;   
          this.barChartGraph(this.expenseDataList);
        });    
    });
  }
  

  pieChartGraph(expenseDataList){
    const categoryTotals = {};
    expenseDataList.forEach(expense => {
      const category = expense.expensesCategory;
      if (category in categoryTotals) {
        categoryTotals[category] += expense.amount;
      } else {
        categoryTotals[category] = expense.amount;
      }
    });

    const pieChartData = Object.keys(categoryTotals).map(category => ({
      name: category,
      y: categoryTotals[category]
    }));

    Highcharts.chart('pieChartContainer', {
      chart: {
        type: 'pie'
      },
      title: {
        text: null
      },
      legend: {
        align: 'center',
        padding: 10,
        title: {
          text: null
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}% (₹{point.y:.2f})</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Amount',
        data: pieChartData
      }]
    });
  }

  columnChartGraph(expenseDataList, selectedDate) {
    const columnChartData = [];
    const drilldownSeries = [];
    const categories = {};
  
    expenseDataList.forEach(expense => {
      const monthYear = this.getMonthYear(expense.expenseDt);
      const category = expense.expensesCategory;
  
      if (!categories[monthYear]) {
        categories[monthYear] = [];
      }
  
      categories[monthYear].push([category, expense.amount]);
    });

    const selectedYear = selectedDate ? new Date(selectedDate).getFullYear() : new Date().getFullYear();
    const selectedMonth = selectedDate ? new Date(selectedDate).getMonth() : new Date().getMonth();

    const allMonths = this.getAllMonths(selectedYear,selectedMonth);
    allMonths.forEach(monthYear => {
      if (!categories[monthYear]) {
        categories[monthYear] = [];
      }
  
      columnChartData.push({
        name: monthYear,
        y: categories[monthYear].reduce((total, entry) => total + entry[1], 0),
        drilldown: monthYear 
      });
  
      const drilldownData = categories[monthYear].map(entry => ({
        name: entry[0],
        y: entry[1]
      }));
      drilldownSeries.push({
        id: monthYear, 
        data: drilldownData
      });
    });
    Highcharts.chart('columnChartContainer', {
      chart: {
        type: 'column'
      },
      title: {
        text: null
      },
      subtitle: {
        text: 'Click the columns to view month details'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total monthly expense amount'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>₹{point.y:.2f}</b> <br/>'
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '₹{point.y:.2f}'
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Months',
        colorByPoint: true,
        data: columnChartData
      }],
      drilldown: {
        series: drilldownSeries
      }
    });
  }

  getAllMonths(selectedYear,selectedMonth): string[] {
    const months = [];
  
    if (selectedMonth < 6) {
      for (let i = 0; i < 6; i++) {
        months.push(`${this.getMonthName(i)} ${selectedYear}`);
      }
    } else {
      for (let i = 6; i < 12; i++) {
        months.push(`${this.getMonthName(i)} ${selectedYear}`);
      }
    }
    
    return months;
  }  
  
  getMonthName(monthIndex) {
    return new Date(new Date().getFullYear(), monthIndex).toLocaleString('default', { month: 'long' });
  }
  
  getMonthYear(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  
  lineChartGraph(expenseDataList, selectedDate) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];  
    const categories = {};
    const selectedYear = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
    for (const expense of expenseDataList) {
      const expenseDate = new Date(expense.expenseDt);
  
      if (expenseDate.getFullYear() === selectedYear) {
        const paymentCategory = expense.paymentCategory;
        if (!categories[paymentCategory]) {
          categories[paymentCategory] = monthNames.map(() => 0);
        }
        
        categories[paymentCategory][expenseDate.getMonth()] += expense.amount; 
      }
    }
    const totals = [];
    for (const payment of this.paymentDataList) {
      const paymentCategory = payment.paymentName;
      const dataObj = {
        name: paymentCategory,
        data: categories[paymentCategory] ? categories[paymentCategory] : monthNames.map(() => 0), 
        type: 'line'
      };
      totals.push(dataObj);
    }
    const xAxisCategories = monthNames.map(m => `${m} ${selectedYear}`);
    return Highcharts.chart('lineChartContainer', {
      chart: {
        type: 'line'
      },
      title: {
        text: null
      },
      xAxis: {
        categories: xAxisCategories
      },
      yAxis: {
        title: {
          text: 'Total monthly expense amount'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y:,.2f}</b><br/>',
        shared: true
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      },
      series: totals
    });
}


  barChartGraph(expenseDataList) {
    const categories = {};
    for (const payment of this.paymentDataList) {
      categories[payment.paymentName] = [];
    }

    const uniqueExpenseCategories = Array.from(new Set(this.expensesCategoryList.map(expense => expense.expensesName)));
    for (const paymentCategory of Object.keys(categories)) {
        categories[paymentCategory] = uniqueExpenseCategories.map(expenseCategory => ({
            expensesCategory: expenseCategory,
            amount: 0
        }));
    }
    for (const expense of expenseDataList) {
        const paymentCategory = expense.paymentCategory;
        const categoryIndex = categories[paymentCategory].findIndex(
            item => item.expensesCategory === expense.expensesCategory
        );
        if (categoryIndex !== -1) {         
            categories[paymentCategory][categoryIndex].amount = expense.amount;
        }
    }

    const seriesData = [];
    for (const paymentCategory of Object.keys(categories)) {
        const data = categories[paymentCategory].map(expense => ({
            name: expense.expensesCategory,
            y: expense.amount
        }));
        seriesData.push({
            name: paymentCategory,
            data: data
        });
    }

    return Highcharts.chart('barChartContainer', {
      chart: {
        type: 'bar'
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total Amount'
        },
        tickInterval: 500 
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: seriesData
    });
  }

  editData(expense) {
      const dialogRef = this.dialog.open(ManageExpenseComponent, {
      data: expense,
      hasBackdrop: true,
      disableClose: true,    
    });
  }

  navigateToViewHome() {
    this.dashboardComponent.navigateToHome();
  }

}
