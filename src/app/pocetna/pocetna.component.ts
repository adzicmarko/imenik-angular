import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ServisService } from '../servis.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  @ViewChild('closebutton', { static: false }) closebutton;

  constructor(private http: HttpClient, private toastr: ToastrService, private servis: ServisService) { }

  ngOnInit(): void {
    this.servis.proveriToken();
    setInterval(() => { this.servis.proveriToken(); }, 50000);

    this.formdata = new FormGroup({
      imeIprezime: new FormControl("", this.imeIprezimeValidacija),
      telefon: new FormControl("", this.telefonValidacija),
    });


    this.izlistajKontakte();
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


  dodajKontakt(podaci) {
    let kontakt = {
      imeiprezime: podaci.imeIprezime,
      telefon: podaci.telefon
    };
    let jsonKontakt = JSON.stringify(kontakt);
    this.upisiKontakt(jsonKontakt).subscribe((data) => {
      if (Object(data).sifra == 1) {
        this.toastr.success('Info', Object(data).poruka);
      } else {
        this.toastr.error('Greška', Object(data).poruka);
      }
    });
    this.izlistajKontakte();
  }

  izlistajKontakte() {
    this.kontakti = [];
    this.ucitajKontakte().subscribe((data) => {
      for (let i = 0; i < Object(data).length; i++) {
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

  prikaziKontakt(id) {
    this.ucitajKontakt(id).subscribe((data) => {
      this.kontaktImeIprezime = Object(data).imeiprezime;
      this.kontaktTelefon = Object(data).telefon;
      this.idKontakta = id;
      this.vremeUpisa = Object(data).vreme_upisa;
    });
  }

  izmeniKontakt(id, izmenjenoIme, izmenjenTelefon) {
    for (let i = 0; i < this.kontakti.length; i++) {
      if (this.kontakti[i].id == id) {
        if(izmenjenoIme.length < 1 || izmenjenTelefon.length < 1){
          this.toastr.error('Info', "Popunite sva polja");
        } else {
        this.kontakti[i].imeiprezime = izmenjenoIme;
        this.kontakti[i].telefon = izmenjenTelefon;
        let jsonIzmenjenKontakt = JSON.stringify(this.kontakti[i]);
        this.izmenaKontakta(id, jsonIzmenjenKontakt).subscribe((data) => {
          this.toastr.success('Info', Object(data).poruka);
          this.closebutton.nativeElement.click();
        });
      }
      }
    }
  }

  obrisiKontakt(id){
    this.brisanjeKontakta(id).subscribe((data)=>{
      this.toastr.success('Info', Object(data).poruka);
      this.izlistajKontakte();
    }); 
  }

  upisiKontakt(kontakt) {
    return this.http.post(this.servis.apiUrl + "dodajKontakt/" + this.servis.token, kontakt);
  }
  ucitajKontakte() {
    return this.http.get(this.servis.apiUrl + "ucitajKontakte/" + this.servis.token);
  }
  ucitajKontakt(id) {
    return this.http.get(this.servis.apiUrl + "kontaktInfo/" + this.servis.token + "/" + id);
  }
  izmenaKontakta(id, kontakt) {
    return this.http.post(this.servis.apiUrl + "izmeniKontakt/" + this.servis.token + "/" + id, kontakt);
  }
  brisanjeKontakta(id) {
    return this.http.get(this.servis.apiUrl + "obrisiKontakt/" + this.servis.token + "/" + id);
  }








  }
