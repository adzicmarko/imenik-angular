import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServisService {

  constructor() { }

  logout (){
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    location.href = "login";    
}
proveriToken (){
    var token = localStorage.getItem("token");
    if(token==null){
        this.logout();
    // } else {
    //     $.get( "http://obrada.in.rs/api/proveriToken/"+token, function( data ) {
    //         if(data.sifra == 0){
    //             this.logout();
          //   }
          // });
    }
}
 
// setInterval(function(){
//     proveriToken();
// }, 50000);
 
firstload(){
    // $("#welcomiduser").html(localStorage.getItem("username"));
}



apiUrl = "http://obrada.in.rs/api/";





}
