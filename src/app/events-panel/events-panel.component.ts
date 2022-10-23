import { Component, Input, OnInit } from '@angular/core';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Match } from '../model/match';
import { Player } from '../model/player';
import { SportEvent } from '../model/sportEvent';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'events-panel',
  templateUrl: './events-panel.component.html'
  
})
export class EventsPanelComponent implements OnInit {

  constructor(Supasvc:SupabaseService) { }

  ngOnInit() {
    this.isLoading = false
  }
  isLoading = true
  @Input() activeMatch: Match
  @Input() videoTime: number
  errorMsg = '';
  results =  ["15","1","0","0","30","2","0","0"]
  selectedResultIdx = null
  possibleResultValues=["0","15","30","40", "A", "+1", "-1"]


  getEventsByBalance(b){
    return this.activeMatch?.events.filter(x=>x.balance == b);
  }

  eventsInput =  null
  eventsHistory = [];

  selectPlayer(p: Player){
    if(this.eventsInput != null){
      this.errorMsg = 'Ya hay un jugador seleccionado / There is already a selected player'
      return;
    }

    this.eventsInput = {player: p, events: []}
  }

  selectEvent(e: SportEvent){
    if(this.eventsInput === null){
      this.errorMsg = 'Seleccione un jugador primero / Select a player first'
      return;
    }
    this.eventsInput.events.push(e);
  }
  
  undo(){
    if(this.eventsInput === null)
      return
    
    if(this.eventsInput.events.length > 0){
      this.eventsInput.events.splice(-1)
    }
    else
    {
      this.eventsInput = null;
    }
  }

  setResult(value){
    if(this.selectedResultIdx === null){
      this.errorMsg = "Primero Seleccione la casilla de resultados que desea modificar / First select the cell of results you want to modofy"
      return;
    }

    if(value.startsWith("+") || value.startsWith("-") ){
      const currentResultValue = parseInt(this.results[this.selectedResultIdx])
      if(currentResultValue == NaN) {
        this.errorMsg = "No es un número / It is not a number"
        return;
      }
      this.results[this.selectedResultIdx] = (currentResultValue + parseInt(value)).toString()
    } 
    else{
      this.results[this.selectedResultIdx] = value;
    }
  }
  

  saveRow(){
    this.eventsHistory.push(this.eventsInput);
    this.eventsInput = null;
  }

}


