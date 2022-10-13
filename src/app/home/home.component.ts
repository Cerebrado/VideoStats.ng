import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Match } from '../model/match';
import { Player } from '../model/player';
import { SupabaseService } from '../supabase.service';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(public readonly supaService: SupabaseService,
    private readonly router: Router) {}

  activeMatch: Match;
  activeId = 0
  
  
  @ViewChild(VideoComponent, {static:true})
  video: VideoComponent

  async ngOnInit(){
    let {data:  activeMatch, error}  = await this.supaService.db
    .from('Matches')
    .select(`*, 
      sport: Sports(name),
      place: Places(name)
    `)
    .eq('active', true)
    .single()
    
    if(error){
      if(error){
        alert('Cannot get active match, check console') 
        console.log(error)
        return;
      }
    }

    if(activeMatch != null){
      this.activeMatch = activeMatch
    }
    this.detectDivStyleChanges();
  }
  
  detectDivStyleChanges() {
    const div = document.getElementById('videoDiv');
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutation) => {
      console.log("div style changed");
      observer.disconnect();
      this.video.resizeVideo();
      observer.observe(div, config);
    })
    observer.observe(div, config);
  }


  onNew(){
    this.router.navigate(['/new'])
  }

  videoTime = 0;
  videoTimeChanged(e: number) {
    this.videoTime = e;
  }

  selectdPlayer: Player
  playerSelected(p: Player){
    this.selectdPlayer = p;
  }

  signOut(){
    this.supaService.signOut();
  }
}

