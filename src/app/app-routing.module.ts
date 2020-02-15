import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistracijaComponent } from './registracija/registracija.component';
import { LoginComponent } from './login/login.component';
import { PocetnaComponent } from './pocetna/pocetna.component';



const routes: Routes = [
  {path:"registracija", component:RegistracijaComponent},
  {path:"login", component:LoginComponent},
  {path:"pocetna", component:PocetnaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


export const RoutingComponent = [RegistracijaComponent,LoginComponent,PocetnaComponent]