import { Component, OnInit } from '@angular/core';
import{ActivatedRoute} from '@angular/router' ; 
import {CovidService} from '../covid.service' ;
import {DatePipe} from'@angular/common' ; 
import chart from 'chart.js' ;
import {News} from '../news.model' ;
import { fromEventPattern } from 'rxjs';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers:[DatePipe]

})
export class CountryComponent implements OnInit {
  countryname : string ; 
  newConfirmed : number ; 
  newDeaths : number ;
  newRecovered : number ; 
  totalConfirmed : number ; 
  totalDeaths :number ; 
  totalRecovered : number ;
  activeCases : number ;   
  recoveryRate: number ; 
  mortalityRate: number ;
  date : Date ;
  day : Date ;  
  last7Days =[] ; 
  PieChart=[] ; 
  barChart=[] ;
  lineChart=[] ;
  last7DaysTotal=[] ;
  fromStart=[]   ; 
  deathtable=[] ; 
  recoverytable = [] ; 
  casestable = [] ; 
  news : News [] ;
  newsfound : boolean ;  
  

  constructor(public datepipe: DatePipe , private route : ActivatedRoute, private covid: CovidService) { }
  addData(chart, i ,  data1) {
    chart.data.datasets[i].data.push(data1) ; 
   chart.update();
 }
  addLabel(chart, label){
 chart.data.labels.push(label) ; 
 chart.update() ; 

}

  ngOnInit(): void {
    this.countryname = this.route.snapshot.params.country ; 
    console.log(this.countryname) ;
   
   ////// Country Summary ////
   ////// Pie Chart ////
   
    this.covid.getCountrySummary(this.countryname).subscribe((Country)=> {
      this.newConfirmed= Country.NewConfirmed ;  
      this.totalConfirmed=Country.TotalConfirmed ; 
      this.newRecovered=Country.NewRecovered ; 
      this.newDeaths= Country.NewDeaths ; 
      this.totalDeaths=Country.TotalDeaths ; 
      this.totalRecovered=Country.TotalRecovered ; 
      this.activeCases = this.totalConfirmed-this.totalRecovered-this.totalDeaths ; 
      this.recoveryRate = 100* this.totalRecovered/this.totalConfirmed ;
      this.mortalityRate=100* this.totalDeaths/(this.totalRecovered+this.totalDeaths);
      
      this.PieChart= new chart('pieChart',{
        type: 'pie', 
        data:{
          labels:["Deaths","Recoveries","Active Cases"], 
          datasets:[{
            data: [this.totalDeaths,this.totalRecovered,this.activeCases],
            backgroundColor:[
              'rgb(255,0,0)','rgb(67, 158, 255)','rgb(255, 218, 130)']
          }]
        },
        options:{
          title:{
            Text: "Corona Virus Cases Distribution WorldWide",
            display:"true" }
      }
      })
    })

    //// bar chart /// 

    var today = new Date() ;
    var weekago= new Date() ;
   
    this.covid.getCountryDayOne(this.countryname).subscribe((data)=>{
             for (var i = 0 ; i<8 ; i++){
               this.last7Days[i] =  data[data.length+i-8]; 
       }  
       for (var i =0 ; i<7 ; i++ ) {
         this.last7Days[7-i].Deaths= this.last7Days[7-i].Deaths-this.last7Days[7-i-1].Deaths; 
         this.last7Days[7-i].Recovered= this.last7Days[7-i].Recovered-this.last7Days[7-i-1].Recovered ; 
         this.last7Days[7-i].Confirmed= this.last7Days[7-i].Confirmed-this.last7Days[7-i-1].Confirmed ; 

       }
       

       console.log(this.last7Days) ;
       this.barChart= new chart('barChart',{
        type: 'bar',
        labels:["Deaths","Recoveries","Active Cases"], 
        data:{
          labels:[], 
          datasets:[{
            type: 'bar' , 
            label : "Daily Deaths",
            data: [this.last7Days[1].Deaths,this.last7Days[2].Deaths,this.last7Days[3].Deaths,
            this.last7Days[4].Deaths,this.last7Days[5].Deaths,this.last7Days[6].Deaths,this.last7Days[7].Deaths,],
            backgroundColor:
          'rgb(255,0,0)'
          },
        { type:'bar',
        label: "Daily Recovered" , 
          data: [,this.last7Days[1].Recovered,this.last7Days[2].Recovered,this.last7Days[3].Recovered,
          this.last7Days[4].Recovered,this.last7Days[5].Recovered,this.last7Days[6].Recovered,this.last7Days[7].Recovered],
          backgroundColor:'rgb(67, 158, 255)'
        },
        { type:'bar',
        label : "Daily New Cases",
          data: [this.last7Days[1].Confirmed,this.last7Days[2].Confirmed,this.last7Days[3].Confirmed,
          this.last7Days[4].Confirmed,this.last7Days[5].Confirmed,this.last7Days[6].Confirmed,this.last7Days[7].Confirmed],
          backgroundColor:'rgb(255, 218, 130)'
        }]
        },
        options:{
          title:{
            Text: "Corona Virus Cases Distribution"+ this.countryname,
            display:"true" }
      }
      })
      var k ; 
      for(k=0 ; k<7 ; k++)
      {
        this.addLabel(this.barChart,this.datepipe.transform(weekago.setDate(today.getDate()+k-7),'yyyy-MM-dd'))
      }
         
    
      })

      ///// Line Chart ///// 
     
      this.covid.getCountryDayOne(this.countryname).subscribe((data)=>{
        this.fromStart=data ; 
        console.log(this.fromStart)
        this.lineChart= new chart('lineChart',{
          type: 'line', 
          labels:["Deaths","Recoveries","Active Cases"],
          data:{
            labels:[], 
            datasets:[{
              type: 'line' , 
              data: [],
              label: "Total Deats",
              backgroundColor:
            'rgb(255,0,0)'
            },
          { type:'line',
            data: [],
            label : "Total Recovered",
            backgroundColor:'rgb(67, 158, 255)'
          },
          { type:'line',
            data: [],
            label:"Total Cases",
            backgroundColor:'rgb(255, 218, 130)'
          }]
          },
          options:{
            title:{
              Text: "Corona Virus Cases Distribution WorldWide",
              display:"true" }
        }
        })
        for (var i=0 ; i <this.fromStart.length ; i++) {
          var startday = new Date (this.fromStart[0].Date)  ;
          this.addLabel(this.lineChart,this.datepipe.transform(startday.setDate(startday.getDate()+i),'yyyy-MM-dd')) ;
          this.deathtable.push(parseInt(this.fromStart[i].Deaths)) ;
        this.recoverytable.push(parseInt(this.fromStart[i].Recovered)) ; 
        this.casestable.push(parseInt(this.fromStart[i].Confirmed))
        }
        console.log(this.deathtable) ; 
        console.log(this.casestable) ; 
        console.log(this.recoverytable) ; 
        var j ; 
        for(j=0 ; j<this.deathtable.length ; j++){
        this.addData(this.lineChart,0,this.deathtable[j]) ; 
        this.addData(this.lineChart,1,this.recoverytable[j]) ; 
        this.addData(this.lineChart,2,this.casestable[j]) ; 
             }
     })

     this.covid.getCountryNews(this.countryname).subscribe((news : News[]) => {
      this.news = news ; 
    } )
    this.newsfound= this.news.length > 0 ;  

}
}