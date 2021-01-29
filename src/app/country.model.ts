export class Country {
    Country: string ; 
    NewConfirmed: number ; 
    NewDeaths : number ; 
    NewRecovered : number ;
    TotalConfirmed : number ; 
    TotalDeaths : number ; 
    TotalRecovered: number ;  
    constructor(    Country : string , 
        NewConfirmed: number ,
        NewDeaths : number , 
        NewRecovered : number ,
        TotalConfirmed : number , 
        TotalDeaths : number , 
        TotalRecovered: number    ){
          this.Country = Country ; 
          this.NewConfirmed=NewConfirmed ; 
          this.NewDeaths=NewDeaths ; 
          this.NewRecovered=NewRecovered ; 
          this.TotalConfirmed= TotalConfirmed ; 
          this.TotalDeaths=TotalDeaths ; 
          this.TotalRecovered=TotalRecovered;
        }
}