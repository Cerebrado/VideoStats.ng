import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-newMatch',
  templateUrl: './newMatch.component.html',
})
export class NewMatchComponent implements OnInit {

  constructor(public readonly supaService: SupabaseService,
    private readonly router: Router) { }


  sports = [];

  async ngOnInit() {
    let {data:  sports}  = await this.supaService.db.from('Sports')
    .select('*')
    
    this.sports = sports;
  }

  async deleteSport(i: number){
    if(!confirm(`¿Delete Sport ${this.sports[i].name}, events and matches?`))
      return;

      await this.supaService.db.from('Sports')
      .delete()
      .eq('sportId', this.sports[i].sportId)

      this.sports.splice(i,1);
  }

}
