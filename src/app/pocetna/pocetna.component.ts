import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ServisService } from '../servis.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit {
  formdata;
  kontakti = [];

  constructor(private http: HttpClient, private toastr: ToastrService, private servis: ServisService) { }

  ngOnInit(): void {
    this.servis.proveriToken();
    setInterval(() => {this.servis.proveriToken();}, 50000);
    this.formdata = new FormGroup({
      imeIprezime: new FormControl("", this.imeIprezimeValidacija),
      telefon: new FormControl("", this.telefonValidacija),
    });


    this.izlistajKontakte ();

  }


  imeIprezimeValidacija(polje) {
    if (polje.value.length < 1) {
      return { "imeIprezime": true }
    }
  }
  telefonValidacija(polje) {
    if (polje.value.length < 1) {
      return { "telefon": true }
    }
  }



  dodajKontakt(podaci){
    let kontakt = {
      imeiprezime: podaci.imeIprezime,
      telefon: podaci.telefon
    };
    let jsonKontakt = JSON.stringify(kontakt);
    this.upisiKontakt(jsonKontakt).subscribe((data)=>{
      if (Object(data).sifra == 1){
        this.toastr.success('Info', Object(data).poruka);
      } else {
        this.toastr.error('Grešska', Object(data).poruka);
      }
    });
  }


  izlistajKontakte (){
    this.ucitajKontakte().subscribe((data)=>{
      for (let i =0; i< Object(data).length; i++){
        let kontakt = {
          imeiprezime: Object(data)[i].imeiprezime,
          telefon: Object(data)[i].telefon,
          }
          this.kontakti.push(kontakt);
      }
    });
  }

  upisiKontakt(kontakt){
    return this.http.post(this.servis.apiUrl+"dodajKontakt/"+this.servis.token, kontakt);     
  }

  ucitajKontakte(){
    return this.http.get(this.servis.apiUrl+"ucitajKontakte/"+this.servis.token);     
  }

  


  // $.get("http://obrada.in.rs/api/ucitajKontakte/" + token, function (data) 
  // $.get("http://obrada.in.rs/api/kontaktInfo/" + token + "/" + id, function (data) 
    // $.post("http://obrada.in.rs/api/izmeniKontakt/"+ token + "/" + id, jsonIzmenjenKontakt, function (data) 
  // $.get("http://obrada.in.rs/api/obrisiKontakt/" + token + "/" + id, function (data)





}
