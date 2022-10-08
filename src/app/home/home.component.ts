import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Match } from '../model/match';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(public readonly supaService: SupabaseService,
    private readonly router: Router) {}

  currentMatch: Match;
  activeId = 0
    
  async ngOnInit(){
    let {data:  activeMatch}  = await this.supaService.db
    .from('Matches, Sports.name, Places.name')
    .select(`*, 
      sports(name),
      places(name)
    `)
    .eq('active', true)
    .single()
    
    if(activeMatch != null){
      debugger;
      this.currentMatch = activeMatch
    }
  }
  

  onNew(){
    this.router.navigate(['/new'])
  }

  videoTime = 0;
  videoTimeChanged(e: number) {
    this.videoTime = e;
  }

  signOut(){
    this.supaService.signOut();
  }

}
