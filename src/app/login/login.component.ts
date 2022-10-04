import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginEmail:string;
  loginPwd: string;

  constructor(private readonly supabase: SupabaseService) { }

  ngOnInit() {
  }

  login(){
     this.supabase.signIn(this.loginEmail, this.loginPwd);
  }

}
