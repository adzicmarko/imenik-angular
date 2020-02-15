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
  formatdataModal;
  kontakti = [];
  idKontakta;
  kontaktImeIprezime;
  kontaktTelefon;
  vremeUpisa;
  izmenjenoIme = "";
  izmenjenTelefon = "";

  constructor(private http: HttpClient, private toastr: ToastrService, private servis: ServisService) { }

  ngOnInit(): void {
    this.servis.proveriToken();
    setInterval(() => {this.servis.proveriToken();}, 50000);
    
    this.formdata = new FormGroup({
      imeIprezime: new FormControl("", this.imeIprezimeValidacija),
      telefon: new FormControl("", this.telefonValidacija),
    });
    
    this.formatdataModal = new FormGroup({
      imeIprezimeM: new FormControl(this.imeIprezimeValidacijaM, this.imeIprezimeValidacijaM),
      telefonM: new FormControl(this.imeIprezimeValidacijaM, this.telefonValidacijaM),
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
  imeIprezimeValidacijaM(polje) {
    if (polje.value.length < 1) {      
      this.izmenjenoIme = polje;
      return { "imeIprezimeM": true }
    }
  }
  telefonValidacijaM(polje) {
    if (polje.value.length < 1) {
      this.izmenjenTelefon = polje;
      return { "telefonM": true }
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
          id: Object(data)[i].id,
          vreme: Object(data)[i].vreme_upisa,
          korisnik_id: Object(data)[i].korisnik_id,          
          }
          this.kontakti.push(kontakt);
      }
    });
  }


  prikaziKontakt(id){
    this.ucitajKontakt(id).subscribe((data)=>{
      this.kontaktImeIprezime = Object(data).imeiprezime;
      this.kontaktTelefon = Object(data).telefon;
      this.idKontakta = id;
      this.vremeUpisa = Object(data).vreme_upisa;
    });
  }


  izmeniKontakt(id){
    console.log(id, this.izmenjenoIme);
    // let izmenjenKontakt = {
    //   imeiprezime: id.imeIprezime,
    //   telefon: id.telefon
    // };
    // console.log(izmenjenKontakt.imeiprezime);

    // for (let i = 0; i< this.kontakti.length; i++){
    //   if (this.kontakti[i].idKontakta == id){
    //     this.kontakti[i].imeiprezime = izmenjenKontakt.imeiprezime;
    //     this.kontakti[i].telefon = izmenjenKontakt.telefon;
    //   }
    // }
    this.izlistajKontakte ();












  }

  upisiKontakt(kontakt){
    return this.http.post(this.servis.apiUrl+"dodajKontakt/"+this.servis.token, kontakt);     
  }

  ucitajKontakte(){
    return this.http.get(this.servis.apiUrl+"ucitajKontakte/"+this.servis.token);     
  }

  ucitajKontakt(id){
    return this.http.get(this.servis.apiUrl+"kontaktInfo/"+this.servis.token+"/"+id);     
  }
  


  // $.get("http://obrada.in.rs/api/kontaktInfo/" + token + "/" + id, function (data) 
    // $.post("http://obrada.in.rs/api/izmeniKontakt/"+ token + "/" + id, jsonIzmenjenKontakt, function (data) 
  // $.get("http://obrada.in.rs/api/obrisiKontakt/" + token + "/" + id, function (data)





}
