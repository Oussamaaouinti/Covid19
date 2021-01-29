import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import{User} from '../user.model' ; 
import{News} from '../news.model' ; 
@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})
export class AddnewsComponent implements OnInit {
  user : User ; 
  news : News ; 
  countries : any ; 
  date : any ; 
  description : string ; 
  country : string ; 
  constructor( public covid: CovidService) { }


  ngOnInit(): void {
    this.user = this.covid.getUser() ; 
    this.covid.getCountries().subscribe((data)=>{
      this.countries = data ; 

    })
  }
  addNews(){
    let news : News = { 
      date : new Date (this.date) ,
      description : this.description, 
      country: this.country,  
      author: this.user.displayName
    };
    this.covid.addNews( news) ; 
    this.date=undefined; 
    this.description=undefined;
    this.country=undefined ; 

  }

}
