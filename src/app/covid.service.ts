import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http' ; 
import firebase from 'firebase/app' ; 
import {AngularFireAuth} from '@angular/fire/auth' ; 
import {AngularFirestore} from '@angular/fire/firestore' ; 
import { Observable, Subject } from 'rxjs';
import {User} from './user.model' ; 
import {Country} from './country.model'
import { Router } from '@angular/router';
import {News} from './news.model' ;
import {CustomDatePipe} from './custom-date-pipe' ; 
import { __values } from 'tslib';
@Injectable({
  providedIn: 'root',
  
})
export class CovidService {
  public CustomDatePipe = new CustomDatePipe('yyyy-MM-dd') ; 
  private user: User ; 
  public date: Date ; 
  public country : Country ;
  public countryraws : Country[] ;
  countrytable: any ;   
  constructor( private http:HttpClient ,  private afAuth : AngularFireAuth , private router : Router, private firestore: AngularFirestore) {}
  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider) ;
    console.log(credentials) ; 
    this.user =  {
      uid : credentials.user.uid ,
      displayName : credentials.user.displayName ,
      email : credentials.user.email
      } ;
      localStorage.setItem("user",JSON.stringify(this.user)) ; 
      this.updateUserData() ; 
      this.router.navigate(["news"]) ; 
}
private updateUserData() {
  this.firestore.collection("users").doc(this.user.uid).set({
    uid : this.user.uid , 
    displayName : this.user.displayName , 
    email : this.user.email
  },{merge: true}) ; 
}
getUser() {
  if (this.user==null && this.userSignedIn()) {
    this.user = JSON.parse(localStorage.getItem("user")) ; 
  }
  return this.user ; 
}
userSignedIn ():boolean{
  return JSON.parse(localStorage.getItem("user")) != null ; 
}
signOut(){
  this.afAuth.signOut() ; 
  localStorage.removeItem("user") ; 
  this.user= null ; 
  this.router.navigate(["home"]) ;  
}
 getNews():Observable<any> {
  return this.firestore.collection("news").valueChanges() ;  
   }
   addNews( news : News){
     this.firestore.collection("news").add(news) ; 
   }
   getAllNews():Observable<any>{
     return  this.firestore.collection("news").valueChanges() ; 
    }
    getCountryNews(countryname){
      return this.firestore.collection("news",country=> country.where("country","==",countryname)).valueChanges()
    }
  getAllCountries():Observable<any>{
    return this.firestore.collection("countries").valueChanges(); 
  }
  getCountries():Observable<any>{
    const url="https://api.covid19api.com/countries" ; 
    return this.http.get<any>(url) ; 

  }

  getSummary():Observable<any>{
    const url="https://api.covid19api.com/summary" ;
     return this.http.get<any>(url) ; 
  }

  getData( url ):Observable<any>{
    return this.http.get<any>(url) ; 
}

async getCountryData(){
  //console.log(this.country) ; 
    var data =   await this.http.get<any>("https://api.covid19api.com/summary").toPromise() ; 
    // var dataString = data.toString() ;
    var dataObj= JSON.parse(JSON.stringify(data)) ; 
    //console.log(dataObj.Countries) ; 
    return(dataObj.Countries) ;
}
getCountrySummary(countryname ):Observable<any> {
  return this.firestore.collection("countries").doc(countryname).valueChanges(); 

   }

getCountryDayOne(countryname): Observable<any>{
  return this.http.get("https://api.covid19api.com/dayone/country/"+countryname ) ; 

}
getCountryTotal(countryname) : Observable<any>{
  return this.http.get("https://api.covid19api.com/total/country/"+countryname + "?from=2020-03-01T00:00:00Z&to=2021-01-15T00:00:00Z") ;
}

async updateFirestore(){
 var dataObj1= await this.getCountryData() ;
 console.log(Array.prototype.slice.call(dataObj1)) ; 
 var dataObj = Array.prototype.slice.call(dataObj1) ; 
 this.countryraws=dataObj ; 
 console.log(dataObj) ; 
 console.log(dataObj[0].Country) ; 
 
 var i ; 

 for (i=0 ; i<dataObj.length;i++) { 

 this.firestore.collection("countries").doc(dataObj[i].Country).set({
  Country : dataObj[i].Country, 
  NewConfirmed : dataObj[i].NewConfirmed, 
  NewDeaths : dataObj[i].NewDeaths,
  NewRecovered : dataObj[i].NewRecovered,
  TotalConfirmed : dataObj[i].TotalConfirmed, 
  TotalDeaths : dataObj[i].TotalDeaths, 
  TotalRecovered : dataObj[i].TotalRecovered, 
  },{merge: true}) ; 
}

}

}
