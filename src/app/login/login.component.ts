import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  loginEmail:string;
  loginPwd: string;

  constructor(
    private readonly supabase: SupabaseService, 
    private readonly router: Router) { }

  ngOnInit() {
  }

  login(){
     this.supabase.signIn(this.loginEmail, this.loginPwd)
      .then((response) => {
      if(! response.error){
        this.supabase.setToken(response)
        this.router.navigate(['/'])
      } else {
        response.error.message
      }
    })
    .catch((err) => {
      alert(err.response.text)
    })
  }

}
