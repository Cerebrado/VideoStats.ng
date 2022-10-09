import { Component, OnInit } from '@angular/core'
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { Sport } from '../model/sport'
import { SportEvent } from '../model/sportEvent'
import { Place } from '../model/place'
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
  places: Place[]=[]
  players: Player[]=[]

  selectedSport: Sport | null
  selectedPlace: Place | null
  newPlayer:string = ''

  DB: SupabaseClient
  user_id:string; 
  
  constructor(private modalService: NgbModal, private supaSvc: SupabaseService) { 
    this.DB = supaSvc.db
    this.user_id = supaSvc.getSession()?.user?.id as string
  }

  async ngOnInit() {
    await this.getSports();
    await this.getPlaces();
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

  async getPlaces() {
    this.places = await this.supaSvc.getMany('Places', '*')
    if(this.places.length > 0)
      this.selectedPlace = this.places[0]
  }

  async addPlace(){
    const modal = this.modalService.open(InputBoxComponent)
    modal.componentInstance.label = "Add"
    modal.componentInstance.title = "Place"
    modal.result
      .then(async (result:string) => {
        let {data, error} = await this.DB.from('Places').insert({name: result, user_id: this.user_id}).single()
        if(error){
          alert('Cannot insert places, check console') 
          console.log(error)
          return;
        }
        this.places.push(data)
        this.selectedPlace = data
      })
  }

  async deletePlace(){
    if(this.selectedPlace == null)
      return
    
    if(!confirm('You will delete the place, places, events,  players and statistics associated. Continue?'))
      return;
    let {data, error} = await  this.DB.from('Places').delete().eq('placeId', this.selectedPlace.placeId)
    if(error){
      alert('Cannot delete place, check console') 
      console.log(error)
      return;
    }

    let idx = this.places.findIndex(x=>x.placeId === this.selectedPlace.placeId)
    this.places.splice(idx, 1);

    if(this.places.length == 1) //removed the only one
      this.selectedPlace = null
    else if (idx == this.places.length ) //removed the last one
      this.selectedPlace = this.places[idx-1]
    else
      this.selectedPlace = this.places[idx] //removed any other
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
