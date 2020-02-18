import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ServisService } from '../servis.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  korisnikId;
  username = "";
  email = "";
  vremeRegistracije = "";
  profilPublic = "";
  brojKontakataProfila = "";
  ukupnoKontakata = "";
  staraLozinka = "";
  novaLozinka = "";
  novaLozinka2 = "";

  constructor(private http: HttpClient, private servis: ServisService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.servis.proveriToken();
    setInterval(() => { this.servis.proveriToken(); }, 50000);

    this.prikaziKorisnikInfo();
  }

  prikaziKorisnikInfo() {
    this.dajKorisnikInfo().subscribe((data) => {
      // console.log(data);
      this.korisnikId = data[0].id;
      this.username = data[0].username;
      this.email = data[0].email;
      this.vremeRegistracije = data[0].registration_time;
      this.profilPublic = data[0].public;
      this.brojKontakataProfila = Object(data).ukupno_kontakata;
      this.ukupnoKontakata = Object(data).ukupno_kontakata_svih;
    });

  }

  promenaLozinke() {
    if (this.validacijaPolja() == true){
      let izmenaLozinke = {
        staralozinka: this.staraLozinka,
        novalozinka: this.novaLozinka
      }      
      let jsonLozinka = JSON.stringify(izmenaLozinke);
      console.log(jsonLozinka);

      this.dajLozinku(jsonLozinka).subscribe((data)=>{
        console.log(data);
        if (Object(data).sifra == 1){
        this.toastr.success(Object(data).poruka, 'Info');
        } else {
          this.toastr.error(Object(data).poruka, 'Greška');
        }
      });
    }
  }



  validacijaPolja(){
    if (this.staraLozinka.length < 1) {
      this.toastr.error('Morate uneti staru lozinku', 'Greška!');
      let elementSL = document.getElementById("staraLozinka");
      elementSL.classList.add("greska");
    } else {
      let elementSL = document.getElementById("staraLozinka");
      elementSL.classList.remove("greska");
    }
    if (this.novaLozinka.length < 1) {
      this.toastr.error('Morate uneti novu lozinku', 'Greška!');
      let elementSL = document.getElementById("novaLozinka");
      elementSL.classList.add("greska");
    } else {
      let elementSL = document.getElementById("novaLozinka");
      elementSL.classList.remove("greska");
    }
    if (this.novaLozinka2.length < 1) {
      this.toastr.error('Morate uneti novu lozinku u drugo polje', 'Greška!');
      let elementSL = document.getElementById("novaLozinka2");
      elementSL.classList.add("greska");
    } else {
      let elementSL = document.getElementById("novaLozinka2");
      elementSL.classList.remove("greska");
    }
    if (this.novaLozinka != this.novaLozinka2) {
      this.toastr.warning('Morate uneti istu lozinku u oba polja za novu lozinku', 'Greška!');
    }
    if (this.novaLozinka == this.staraLozinka || this.novaLozinka2 == this.staraLozinka){
      this.toastr.error('Morate izabrati drugaciju lozinku od stare', 'Greška!');
    }
    if (this.staraLozinka.length > 0 && this.novaLozinka.length > 0 && this.novaLozinka2.length > 0 && this.novaLozinka == this.novaLozinka2 && this.novaLozinka != this.staraLozinka)
      return true;
  }




  dajKorisnikInfo() {
    return this.http.get(this.servis.apiUrl + "korisnikInfo/" + this.servis.token);
  }

  dajLozinku(jsonLozinka){
    return this.http.post(this.servis.apiUrl + "izmeniLozinku/" + this.servis.token, jsonLozinka);
  }


}
