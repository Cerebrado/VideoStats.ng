import { Component, EventEmitter, Injectable, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Match } from '../model/match';
import { Player } from '../model/player';
import { SportEvent } from '../model/sportEvent';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-match-players',
  templateUrl: './match-players.component.html'
  
})
export class MatchPlayersComponent implements OnInit {

  constructor(Supasvc:SupabaseService) { }

  ngOnInit() {
    this.isLoading = false
  }
  isLoading = true
  @Input() activeMatch: Match
  @Input() videoTime: number
  
  selectedPlayer: Player
  selectPlayer(p: Player){
    this.selectedPlayer = p;
  }

  selectedEvent: SportEvent
  selectEvent(e: SportEvent){
    this.selectedEvent = e;
  }

  getEventsByBalance(b){
    return this.activeMatch?.events.filter(x=>x.balance == b);
  }
}


