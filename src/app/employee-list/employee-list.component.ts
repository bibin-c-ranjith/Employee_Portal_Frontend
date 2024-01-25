import { Component, OnInit } from '@angular/core';
import { AdminapiService } from '../services/adminapi.service';
import { employeeModel } from '../employee.model';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
  
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  /* OnInit is an interface to implement ngOnInit */

  allEmployee:employeeModel[]=[]

  searchKey:string = ""

  constructor(private api:AdminapiService){}

  /* for pagination */

  p: number = 1;
  

  /* Life Cycle hook - call just after the component is created and constructed is called*/
  ngOnInit(): void {
      this.allEmployeeDetails()
  }
  
  allEmployeeDetails(){
    this.api.getAllEmployeeApi().subscribe({
      next:(res:any)=>{

        this.allEmployee = res
        console.log(this.allEmployee);

        

      },

      error:(err:any)=>{
        console.log(err);
        
      }
    })

  }

  removeEmployee(id:any){
    this.api.deleteEmployeeApi(id).subscribe({
    next:(res:any)=>{
      console.log(res);
      this.allEmployeeDetails();
    },
    error:(err:any)=>{
      console.log(err);
      
    }
    })
  }

  sortId(){
    this.allEmployee.sort((a:any,b:any)=>a.id-b.id)
  }
  sortName(){
    this.allEmployee.sort((a:any,b:any)=>a.name.localeCompare(b.name))
  }

  generatePdf(){
    /* create a object for jsPDF */
    const pdf = new jsPDF()

    let head =  [[ 'Id', 'Employee name','Email','Status']]

    let body : any = []

  this.allEmployee.forEach((item)=>{
    body.push([item.id , item.name ,item.name, item.status])
  })
  /* fontsize */
  pdf.setFontSize(16)
  pdf.text('Employee Details',10 ,10)
  /* Table */
  autoTable(pdf,{head,body})
  /* to open in new tab */
  pdf.output('dataurlnewwindow')

  /* save and download   */
  pdf.save('Employee.pdf')
  }
}
