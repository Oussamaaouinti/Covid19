import { Component, OnInit } from '@angular/core';
import{CovidService} from '../covid.service' ;  
import chart from 'chart.js' ; 
import {DatePipe} from'@angular/common' ; 
import { __values } from 'tslib';
import {News} from '../news.model' ; 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[DatePipe]
})
export class HomeComponent implements OnInit {
  lastweek : string ; 
  last7Days: any ;
  fromApril : any ; 
  date : Date ;
  countrycolumns=[] ; 
  countrytable=[] ;
  countryraws=[] ;
  lineChart=[] ; 
  barChart=[] ;  
  PieChart=[] ;  
  deathtable=[] ;
  recoverytable=[] ; 
  casestable=[] ; 
  newConfirmed : number ; 
  newDeaths : number ;
  newRecovered : number ; 
  totalConfirmed : number ; 
  totalDeaths :number ; 
  totalRecovered : number ;
  activeCases : number ;   
  recoveryRate: number ; 
  mortalityRate: number ; 
  today : string ;  
  news : News[] ; 

  constructor(public datepipe: DatePipe , public covid: CovidService) { }
   
  addData(chart, i ,  data1) {
     chart.data.datasets[i].data.push(data1) ; 
    chart.update();
  }

  addLabel(chart, label){
  chart.data.labels.push(label) ; 
  chart.update() ; 

}

  numberSort = function (a,b) {
    return a - b;
  };

async ngOnInit(): Promise<void> {

    //// News /// 
    
    this.covid.getAllNews();  
    
    /// Update Firestore///
    
    this.covid.updateFirestore() ; 
  
    
    /// Line Chart for data from 13 April ///
    
    this.date = new Date ; 
    // console.log(this.datepipe.transform(this.date,'yyyy-MM-dd')) ;
    this.today =   this.datepipe.transform(this.date,'yyyy-MM-dd') ; 
    this.covid.getData("https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to="+this.today+"T00:00:00Z").subscribe((data)=>{
      this.fromApril= data ;
      //console.log(this.fromApril) ;   
      this.lineChart= new chart('lineChart',{
        type: 'line', 
        labels:["Deaths","Recoveries","Active Cases"],
        data:{
          labels:[], 
          datasets:[{
            type: 'line' , 
            label: "Total Deaths",
            data: [],
            backgroundColor:
          'rgb(255,0,0)'
          },
        { type:'line',
        label: " Total Recovered",
          data: [],
          backgroundColor:'rgb(67, 158, 255)'
        },
        { type:'line',
        label:" Total Cases",
          data: [],
          backgroundColor:'rgb(255, 218, 130)'
        }]
        },
        options:{
          title:{
            Text: "Corona Virus Cases Distribution WorldWide",
            display:"true" }
      }
      })
      var i ;
      
      //pushing labels and constructing datatables for each part 
      for(i=0; i<this.fromApril.length  ; i++)
      {
        var day = new Date(2020,3,13) ; 
        this.addLabel(this.lineChart,this.datepipe.transform(day.setDate(day.getDate()+i),'yyyy-MM-dd')) ; 
        this.deathtable.push(parseInt(this.fromApril[i].TotalDeaths)) ;
        this.recoverytable.push(parseInt(this.fromApril[i].TotalRecovered)) ; 
        this.casestable.push(parseInt(this.fromApril[i].TotalConfirmed))
        }
        this.deathtable.sort(this.numberSort) ; 
        this.recoverytable.sort(this.numberSort) ; 
        this.casestable.sort(this.numberSort) ;  
        var j ; 
        for(j=0 ; j<this.deathtable.length ; j++){
        this.addData(this.lineChart,0,this.deathtable[j]) ; 
        this.addData(this.lineChart,1,this.recoverytable[j]) ; 
        this.addData(this.lineChart,2,this.casestable[j]) ; 
       
        
      }
    });
    
    
    /// barchart for last week data ///


    var today = new Date() ;
    var weekago= new Date() ; 
    this.lastweek =this.datepipe.transform(weekago.setDate(today.getDate()-8),'yyyy-MM-dd') ;
     this.today= this.datepipe.transform(today.setDate(today.getDate()),'yyyy-MM-dd') ; 
     console.log(this.lastweek) ; 
     console.log(this.today) ;  
     this.covid.getData("https://api.covid19api.com/world?from="+this.lastweek+"T00:00:00Z&to="+this.today+"T00:00:00Z").subscribe((data)=>{
      this.last7Days= data ;
      this.barChart= new chart('barChart',{
        type: 'bar',
        labels:["Deaths","Recoveries","Active Cases"], 
        data:{
          labels:[], 
          datasets:[{
            type: 'bar' , 
            label : "Daily Deaths",
            data: [this.last7Days[0].NewDeaths,this.last7Days[1].NewDeaths,this.last7Days[2].NewDeaths,this.last7Days[3].NewDeaths,
            this.last7Days[4].NewDeaths,this.last7Days[5].NewDeaths,this.last7Days[6].NewDeaths],
            backgroundColor:
          'rgb(255,0,0)'
          },
        { type:'bar',
          label: "Daily Recovered",
          data: [this.last7Days[0].NewRecovered,this.last7Days[1].NewRecovered,this.last7Days[2].NewRecovered,this.last7Days[3].NewRecovered,
          this.last7Days[4].NewRecovered,this.last7Days[5].NewRecovered,this.last7Days[6].NewRecovered],
          backgroundColor:'rgb(67, 158, 255)'
        },
        { type:'bar',
        label:"Daily New Cases" , 
          data: [this.last7Days[0].NewConfirmed,this.last7Days[1].NewConfirmed,this.last7Days[2].NewConfirmed,this.last7Days[3].NewConfirmed,
          this.last7Days[4].NewConfirmed,this.last7Days[5].NewConfirmed,this.last7Days[6].NewConfirmed],
          backgroundColor:'rgb(255, 218, 130)'
        }]
        },
        options:{
          title:{
            Text: "Corona Virus Cases Distribution WorldWide",
            display:"true" }
      }
      })
      var k ; 
      for(k=0 ; k<7 ; k++)
      {
        today=new Date() ; 
        weekago=new Date() ; 
        this.addLabel(this.barChart,this.datepipe.transform(weekago.setDate(today.getDate()-7+k),'yyyy-MM-dd'))
      }
        
        });
        
        
        /// Summary table ////
       
          this.covid.getSummary().subscribe((data)=> {
              this.newConfirmed= data.Global.NewConfirmed ; 
              this.totalConfirmed=data.Global.TotalConfirmed ; 
              this.newRecovered=data.Global.NewRecovered ; 
              this.newDeaths= data.Global.NewDeaths ; 
              this.totalDeaths=data.Global.TotalDeaths ; 
              this.totalRecovered=data.Global.TotalRecovered ; 
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

                    });
        this.covid.getNews().subscribe((news : News[]) => {
          this.news = news ; 
        } )
        
   
}
}