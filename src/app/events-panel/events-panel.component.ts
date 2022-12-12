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

  isLoading = true
  @Input() activeMatch: Match 
  @Input() videoTime: number
  errorMsg = '';

  eventsInputs = []
  eventsHistory = [];


  ngOnInit() {
    this.isLoading = false
    
  }


  getEventsByBalance(b){
    return this.activeMatch?.sport.events.filter(x=>x.balance == b);
  }

  selectPlayer(p: Player){
    if(this.eventsInputs.length > 0
        &&
      this.eventsInputs[this.eventsInputs.length -1].events.length === 0){
        this.eventsInputs[this.eventsInputs.length -1].player = p
    }
    else {
      this.eventsInputs.push({player: p, events: []})
    }
  }

  selectEvent(e: SportEvent){
    if(this.eventsInputs.length === 0){
      this.errorMsg = 'Seleccione un jugador primero / Select a player first'
      return;
    }
    this.eventsInputs[this.eventsInputs.length - 1].events.push(e);
  }
  
  undo(){
    if(this.eventsInputs.length === 0)
      return
    
    if(this.eventsInputs[this.eventsInputs.length-1].events.length > 0){
      this.eventsInputs[this.eventsInputs.length-1].events.splice(-1)
    }
    else
    {
      this.eventsInputs.splice(-1);
    }
  }




  // setResult(value){
  //   if(this.selectedResultIdx === null){
  //     this.errorMsg = "Primero Seleccione la casilla de resultados que desea modificar / First select the cell of results you want to modofy"
  //     return;
  //   }

  //   if(value.startsWith("+") || value.startsWith("-") ){
  //     if(isNaN(Number(this.results[this.selectedResultIdx]))) {
  //       this.errorMsg = "No es un número / It is not a number"
  //       return;
  //     }
  //     const currentResultValue = parseInt(this.results[this.selectedResultIdx])
  //     this.results[this.selectedResultIdx] = (currentResultValue + parseInt(value)).toString()
  //   } 
  //   else{
  //     this.results[this.selectedResultIdx] = value;
  //   }
  // }
  

  saveRow(){
    this.eventsHistory.push(this.eventsInputs);
    this.eventsInputs = [];
  }

}


