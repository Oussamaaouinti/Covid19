import { Component, OnInit, ViewChild } from '@angular/core';
import {CovidService} from '../covid.service' ; 
import {Country} from '../country.model' ; 
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort' ; 
@Component({
  selector: 'app-countries-table',
  templateUrl: './countries-table.component.html',
  styleUrls: ['./countries-table.component.css']
})
export class CountriesTableComponent implements OnInit {
  ELEMENT_DATA!  : Country [] ; 
  displayedColumns  :  string[] = ['Country','NewConfirmed', 'TotalConfirmed', 'NewRecovered', 'TotalRecovered', 'NewDeaths', 'TotalDeaths'];
  dataSource  = new MatTableDataSource<Country>(this.ELEMENT_DATA);

  constructor(private covid: CovidService) { }

  @ViewChild(MatSort, {static: true} ) sort: MatSort ; 

 
  


  ngOnInit(): void {
    this.covid.getAllCountries().subscribe((result)=> {
      this.dataSource.data=result as Country[] ;}) 
      this.dataSource.sort=this.sort ; 
    }
  
    
  }

