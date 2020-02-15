import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServisService } from '../servis.service';


@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  formdata;


  constructor(private http: HttpClient, private toastr: ToastrService, private servis: ServisService) { }

  ngOnInit(): void {

    this.formdata = new FormGroup({
      korisnickoIme: new FormControl("", this.korisnickoImeValidacija),
      email: new FormControl("", this.emailValidacija),
      sifra1: new FormControl("", this.sifra1Validacija),
      sifra2: new FormControl("", this.sifra2Validacija)
    });
  }

  korisnickoImeValidacija(polje) {
    if (polje.value.length < 1) {
      return { "korisnickoIme": true }
    }
  }

  sifra1Validacija(polje) {
    if (polje.value.length < 1) {
      return { "sifra1": true }
    }
  }

  sifra2Validacija(polje) {
    if (polje.value.length < 1) {
      return { "sifra2": true }
    }
  }

  emailValidacija(polje) {
    if (polje.value.length < 1) {
      return { "email": true }
    }
  }

  obradaForme(podaci) {
    if (this.formdata.value.sifra1 != this.formdata.value.sifra2) {
      this.toastr.error('Šifre nisu iste', 'Greška!');
    } else {
      let korisnik = {
        username: podaci.korisnickoIme,
        password: podaci.sifra1,
        email: podaci.email
      };
      let korisnikJson = JSON.stringify(korisnik);
      
      this.posaljiRegistraciju(korisnikJson).subscribe((data) => {
        console.log(data);
        if (Object(data).sifra == 0){
          this.toastr.error(Object(data).poruka, 'Greška');
        } else if (Object(data).sifra == 1){
          this.toastr.success(Object(data).poruka, 'Info');
          document.location.href = '/login';
        } else {
          this.toastr.warning(Object(data).poruka, 'Info');
        }
      });
    }
  }

  posaljiRegistraciju (parametri){
    return this.http.post(this.servis.apiUrl+"registracija", parametri);
  }

}
