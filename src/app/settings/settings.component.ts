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
import { SportScore } from '../model/sportScore'
import { runInThisContext } from 'vm'
import { EditScoreComponent } from '../edit-score/edit-score.component'



@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

  sports: Sport[]=[]
  selectedSport: Sport | null

  newEvent:string = ''
  newEventBalance:number = 0

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
    this.sports = await this.supaSvc.getMany('Sports','*');
    if(this.sports.length > 0)
    this.selectedSport = this.sports[0]
  }

  async addSport(){
    const modal = this.modalService.open(InputBoxComponent)
    modal.componentInstance.label = "Add"
    modal.componentInstance.title = "Sport"
    modal.result
      .then(async (result:string) => {
        let {data, error} = await this.DB.from('Sports').insert({name: result, user_id: this.user_id, events: [], scores:[]}).single()
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
    this.selectedSport.events.push({name: this.newEvent, balance: this.newEventBalance})
    this.newEvent = '';
  }

  async deleteEvent(idx: number){
    this.selectedSport.events.splice(idx, 1);
  }

  async addScore(){
    let newScore: SportScore = {
      name: '', 
      slots: 1,
      type: '+/-',
      values: [],
      showAsButtons: false,
      visibleAtBeggining: true,
    };
    const modal = this.modalService.open(EditScoreComponent, { size: 'lg' })
    modal.componentInstance.score = newScore;
    modal.result
      .then(async (score:SportScore) => {
        this.selectedSport.scores.push(score)
        this.saveSport();
      })
  }

  editScore(scoreIdx){
    let editScore: SportScore =  {
      name: this.selectedSport.scores[scoreIdx].name, 
      slots: this.selectedSport.scores[scoreIdx].slots,
      type: this.selectedSport.scores[scoreIdx].type,
      values: [...this.selectedSport.scores[scoreIdx].values],
      showAsButtons: this.selectedSport.scores[scoreIdx].showAsButtons,
      visibleAtBeggining: this.selectedSport.scores[scoreIdx].visibleAtBeggining,
    }


    const modal = this.modalService.open(EditScoreComponent,  { size: 'lg' })
    modal.componentInstance.score = editScore;
    modal.result
      .then(async (score:SportScore) => {
        this.selectedSport.scores[scoreIdx] = editScore;
        this.saveSport();
      })
  }

  deleteScore(scoreIdx){
    this.selectedSport.scores.splice(scoreIdx,1);
    this.saveSport();
  }

  async saveSport(){
    let {data, error} = await this.DB
    .from('Sports')
    .update({events: this.selectedSport.events, scores: this.selectedSport.scores})
    .eq('user_id', this.user_id)
    .eq('sportId', this.selectedSport.sportId)
    .select() 
    if(error){
      alert('Cannot update sport, check console') 
      console.log(error)
      return;
    }

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
