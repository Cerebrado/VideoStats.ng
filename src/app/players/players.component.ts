import { Component, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, filter} from 'rxjs/operators';
import { Player } from '../model/player';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})


export class PlayersComponent implements OnInit {
  db: SupabaseClient;
  newPlayerName: string = '';
  players: Player[];
  selectedPlayer;

  userId:string; 

  constructor(private readonly supaSvc: SupabaseService) {
    this.db = supaSvc.db;
    this.userId = supaSvc.getSession()?.user?.id as string
  }


  async ngOnInit() {
    let { data: players, error } = await this.db
    .from('Players')
    .select('*')
    .order('playerId', { ascending: false })

  
    if (error) {
      alert('supaService: ' + error.message);
    } else {
      this.players = players
    }

  }

  addPlayermsg: string;
  async addNewPlayer() {

    let { data: existingPlayer} = await this.db.from('Players')
    .select('*')
    .eq('name', this.newPlayerName)
    .single();
    if (existingPlayer != null){
      this.addPlayermsg = 'Player already exists'
    }
    
    let { data: player, error } = await this.db.from('Players')
    .insert({name: this.newPlayerName, userId: this.userId}) 
    .single()
    if (error) {
      alert(error.message);
    } else {
      this.players.push(player);
    }
  }
  
  formatter = (p:Player) => p.name;
  search: OperatorFunction<string, readonly Player[]> = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => 
        this.players.filter(p => new RegExp(term, 'mi').test(p.name)).slice(0, 10))
  );
}
