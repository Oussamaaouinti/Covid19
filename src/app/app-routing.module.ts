import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import {AddnewsComponent} from './addnews/addnews.component' ; 
import { AuthGuard } from './auth.guard';
import { NewsComponent } from './news/news.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"country",component:CountryComponent},
  {path:"",pathMatch:"full",redirectTo:"home"},
  {path:"news",component:NewsComponent,canActivate: [AuthGuard]},
  {path:'country/:country', component:CountryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
