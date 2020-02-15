import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServisService {
  apiUrl = "http://obrada.in.rs/api/";
  token = "";
  
  constructor(private http: HttpClient) { }

  logout (){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    document.location.href = '/login';  
}

proveriToken (){
    this.token = localStorage.getItem("token");
    if(this.token==null){
        this.logout();
    } else {
      this.pokupiToken().subscribe((data)=>{
        console.log(data);
        if (Object(data).sifra != 1){
          this.logout ();
        }
      });
     }
}
 
firstload(){
    // $("#welcomiduser").html(localStorage.getItem("username"));
}


pokupiToken (){
  return this.http.get(this.apiUrl+"proveriToken/"+this.token);
}








}
