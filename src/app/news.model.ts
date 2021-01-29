export class News {
    author : string ; 
    date : Date ; 
    description : string ; 
    country : string ; 
    constructor(author : string , 
        date : Date ,
        description : string , 
        country : string  ){
            this.author= author ; 
            this.date = date ; 
            this.description= description ; 
            this.country = country ; 
        }
}