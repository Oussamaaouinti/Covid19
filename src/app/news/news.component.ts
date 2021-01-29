import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import{User} from '../user.model' ; 
import{News} from '../news.model' ; 

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
   user : User ; 
   news : News[] ; 


  constructor(public covid: CovidService) { }

  ngOnInit(): void {
    this.user = this.covid.getUser() ; 
    this.covid.getNews().subscribe((news : News[]) => {
      this.news = news ; 
    } )
  }

}
