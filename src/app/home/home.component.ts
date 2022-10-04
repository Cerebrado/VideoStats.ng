import { Component, ElementRef, VERSION, ViewChild } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(public readonly supaService: SupabaseService) {}

  signOut(){
    this.supaService.signOut();
  }
  videoTime = 0;
  videoTimeChanged(e: number) {
    this.videoTime = e;
  }
}
