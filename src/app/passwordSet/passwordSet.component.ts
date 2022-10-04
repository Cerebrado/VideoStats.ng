import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-passwordSet',
  templateUrl: './passwordSet.component.html',
})
export class PasswordSetComponent implements OnInit {

  constructor(private readonly supaService: SupabaseService) { }

  ngOnInit() {
  }

  pwd1:string;
  pwd2:string;
  errormsg = '';
  
  async setPwd(){
    if(this.pwd1.trim() === '') {
      this.errormsg='not valid password'
      return;
    };
    
    if(this.pwd1.trim() != this.pwd2.trim())  {
      this.errormsg="passwords don't match";
      return;
    }
    try 
    {
      await this.supaService.setNewPassword(this.pwd1)
    }
    catch(error){
      this.errormsg ="there were errors, please, retry later";
      console.error(error);
    }
  }

}
