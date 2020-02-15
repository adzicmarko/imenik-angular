import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServisService } from '../servis.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formdata;
  

  constructor(private http: HttpClient, private toastr: ToastrService, private servis: ServisService) { }

  ngOnInit(): void {

    this.formdata = new FormGroup({
      korisnickoIme: new FormControl("", this.korisnickoImeValidacija),
      email: new FormControl("", this.emailValidacija),
      sifra: new FormControl("", this.sifraValidacija)
    });
  }

  korisnickoImeValidacija(polje) {
    if (polje.value.length < 1) {
      return { "korisnickoIme": true }
    }
  }

  sifraValidacija(polje) {
    if (polje.value.length < 1) {
      return { "sifra": true }
    }
  }

  emailValidacija(polje) {
    if (polje.value.length < 1) {
      return { "email": true }
    }
  }

  obradaForme(podaci) {
      let korisnik = {
        username: podaci.korisnickoIme,
        password: podaci.sifra,
        email: podaci.email
      };
      let korisnikJson = JSON.stringify(korisnik);      
      this.posaljiLogovanje(korisnikJson).subscribe((data) => {
        console.log(data);
        if (Object(data).sifra == 0){
          this.toastr.error(Object(data).poruka, 'Greška');
        } else if (Object(data).sifra == 1){
          this.toastr.success(Object(data).poruka, 'Info');
          // document.location.href = '/login';
          let token = Object(data).token;          
          localStorage.setItem("token", token);
        } else {
          this.toastr.warning(Object(data).poruka, 'Info');
        }
      });    
  }

  posaljiLogovanje (parametri){
    return this.http.post(this.servis.apiUrl+"login", parametri);
  }
}
