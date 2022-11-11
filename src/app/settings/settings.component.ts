import { Component, OnInit } from '@angular/core'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { Sport } from '../model/sport'
import { SportEvent } from '../model/sportEvent'
import { Player } from '../model/player'
import { NewEventComponent } from '../new-event/new-event.component'
import { InputBoxComponent } from '../input-box/input-box.component'

import { SupabaseService } from '../supabase.service'
import { SupabaseClient } from '@supabase/supabase-js'



@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

  sports: Sport[]=[]
  selectedSport: Sport | null
  
  finalScoreSlots= 1
  finalScoreMode= 0
  finalScoreValues:string[]= ['1','+1']
  newFinalScoreValueModifier= 0
  newFinalScoreValue= ''

  partialScoreSlots= 1
  partialScoreMode= 0
  partialScoreValues:string[] = [];
  newPartialScoreValueModifier = 0
  newPartialScoreValue= ''

  players: Player[]=[]
  newPlayer:string = ''

  DB: SupabaseClient
  user_id:string; 
  
  constructor(private modalService: NgbModal, private supaSvc: SupabaseService) { 
    this.DB = supaSvc.db
    this.user_id = supaSvc.getSession()?.user?.id as string
  }

  async ngOnInit() {
    await this.getSports();
    await this.getPlayers();
  }

  async getSports() {
    this.sports = await this.supaSvc.getMany('Sports',`*, SportEvents: Events(*)`);
    if(this.sports.length > 0)
      this.selectedSport =this.sports[0]
  }

  async addSport(){
    const modal = this.modalService.open(InputBoxComponent)
    modal.componentInstance.label = "Add"
    modal.componentInstance.title = "Sport"
    modal.result
      .then(async (result:string) => {
        let {data, error} = await this.DB.from('Sports').insert({name: result, user_id: this.user_id}).single()
        if(error){
          alert('Cannot insert sport, check console') 
          console.log(error)
          return;
        }
        data.Events  = []
        this.sports.push(data);
        this.selectedSport = data;
      })
  }


  async deleteSport(){
    if(this.selectedSport == null)
      return
    
    if(!confirm('You will delete the sport, places, events,  players and statistics associated. Continue?'))
      return;
    let {data, error} = await  this.DB.from('Sports').delete().eq('sportId', this.selectedSport.sportId)
    if(error){
      alert('Cannot delete sport, check console') 
      console.log(error)
      return;
    }

    let idx = this.sports.findIndex(x=>x.sportId === this.selectedSport.sportId)

    if(this.sports.length == 1) //removed the only one
      this.selectedSport = null
    else if (idx == this.sports.length -1 ) //removed the last one
      this.selectedSport = this.sports[idx-1]
    else
      this.selectedSport = this.sports[idx] //removed any other

    this.sports.splice(idx, 1);
  }     


  addEvent(){
    if(this.selectedSport == null)
      return

    const modal = this.modalService.open(NewEventComponent)
    modal.componentInstance.sportId = this.selectedSport.sportId
    
    modal.result
      .then(async (result:SportEvent) => {
      let {data, error} = await this.DB.from('Events').insert({sportId: this.selectedSport.sportId,  name: result.name, balance: result.balance, user_id: this.user_id}).single()
      if(error){
        alert('Cannot insert event, check console') 
        console.log(error)
        return;
      }
      this.selectedSport.SportEvents.push(data);
    })
  }


  async deleteEvent(idx: number){
    if(!confirm('You will delete the event and statistics associated. Continue?'))
      return;
    const event = this.selectedSport.SportEvents[idx];
    let {data, error} = await  this.DB.from('Events').delete().eq('eventId', event.eventId)
    if(error){
      alert('Cannot delete event, check console') 
      console.log(error)
      return;
    }
    this.selectedSport.SportEvents.splice(idx, 1);
  }

  addFinalScoreValue(){
    let modifier=''
    if(this.newFinalScoreValueModifier === 1)
    {
      modifier='+'
    }
    else if(this.newFinalScoreValueModifier === 1)
    {
      modifier='-'
    }

    this.finalScoreValues.push(modifier + this.newFinalScoreValue);
  }

  deleteFinalScoreValue(value){
    var idx = this.finalScoreValues.findIndex(x=>x == value);
    this.finalScoreValues.splice(idx, 1);
  }


  addPartialScoreValue(){
    let modifier=''
    if(this.newPartialScoreValueModifier === 1)
    {
      modifier='+'
    }
    else if(this.newPartialScoreValueModifier === 1)
    {
      modifier='-'
    }

    this.partialScoreValues.push(modifier + this.newPartialScoreValue);
  }

  deletePartialScoreValue(value){
    var idx = this.partialScoreValues.findIndex(x=>x == value);
    this.partialScoreValues.splice(idx, 1);
  }


  async getPlayers() {
    this.players = await this.supaSvc.getMany('Players', '*')
  }

  async addPlayer(){
    if(this.newPlayer == '')
      return
    
    if(this.players.some(x=>x.name == this.newPlayer)){
        alert('Player ' + this.newPlayer + ' already exists')
        this.newPlayer = ''
        return
    }
    let {data, error} = await this.DB.from('Players').insert({name: this.newPlayer, user_id: this.user_id }).single() 
    if(error){
      alert('Cannot add player, check console') 
      console.log(error)
      return;
    }

    this.players.push(data)   
    this.newPlayer = ''
  }

  async deletePlayer(idx:number) {
    if(!confirm('You will delete the player and statistics associated. Continue?'))
      return;
    const player = this.players[idx]
    let {data, error} = await  this.DB.from('Players').delete().eq('playerId', player.playerId)
    if(error){
      alert('Cannot delete player, check console') 
      console.log(error)
      return;
    }
    this.players.splice(idx, 1);
  }
}
