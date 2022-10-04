import { Component, ElementRef, VERSION, ViewChild } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public readonly supaService: SupabaseService) {

  }

  videoTime = 0;
  videoTimeChanged(e: number) {
    this.videoTime = e;
  }
}
