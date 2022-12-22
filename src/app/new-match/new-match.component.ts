import {  Component, ElementRef, ViewChild} from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Match } from '../model/match';
import { Player } from '../model/player';
import { Sport } from '../model/sport';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'new-match',
  templateUrl: './new-match.component.html',
})
export class NewMatchComponent {

  constructor(private supaSvc: SupabaseService, private router: Router) { 
    this.DB = supaSvc.db;
    this.user_id = supaSvc.getSession()?.user?.id as string
  }

   @ViewChild('ytPlayer') ytPlayer: any;

  sports: Sport[]=[];
  availablePlayers: Player[]=[];
  filteredPlayers: Player[]=[];
  
  selectedSport: Sport 
  name: string = ''
  ngdate: NgbDate
  hour: number 
  minutes: string = '00' 
  matchPlayers: Player[] = []
  videoId:string = ''

  newPlayer:string = ''
  searchPlayerText:string = ''
  videoIdValid = false;

  user_id: string
  DB: SupabaseClient

  async ngOnInit() {
    const today = new Date();
    this.ngdate = new NgbDate(today.getFullYear(), today.getMonth() + 1,today.getDate());
    this.hour = today.getHours(),
    await this.getSports();
    await this.getAvailablePlayers();
    this.searchPlayerChange(null);

    //adding yt api here, instead of in index.html
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  async getSports() {
    this.sports = await this.supaSvc.getMany('Sports',`*`);

    if(this.sports.length > 0)
      this.selectedSport = this.sports[0]
  }

  async getAvailablePlayers() {
    this.availablePlayers=await this.supaSvc.getMany('Players',`*`);;
  }

  searchPlayerChange(e){
    if(this.searchPlayerText == '')
      this.filteredPlayers = [...this.availablePlayers]
    else
      this.filteredPlayers = [...this.availablePlayers.filter(x=>x.name.toLowerCase().indexOf(this.searchPlayerText.toLocaleLowerCase()) > -1)]
  }

  async addPlayer(){
    if(this.newPlayer == '')
      return
    
    if(this.availablePlayers.some(x=>x.name == this.newPlayer)){
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

    this.availablePlayers.push(data)   
    this.newPlayer = ''
  }

  confirmPlayer(p: Player) {
    this.matchPlayers.push(p);
    const idx = this.availablePlayers.findIndex(x=>x.playerId === p.playerId);
    this.availablePlayers.splice(idx,1);
    this.searchPlayerChange(null);
  }
  
  unconfirmPlayer(p: Player) {
    const idx = this.matchPlayers.findIndex(x=>x.playerId === p.playerId);
    this.matchPlayers.splice(idx, 1);
    this.availablePlayers.push(p);
    this.searchPlayerChange(null);
  }

  async loadVideo() {
    this.ytPlayer.videoId = this.videoId;
  }
  onYTReady(){
  }
  onYTStateChange($event){
  this.videoIdValid =this.ytPlayer.getDuration() > 0;
  }

  async btnConfirmNewMatchClick() {
    if(this.videoId.trim()===''){
      alert('Not video Id entered');
      return;

    }
    
    if(!this.videoIdValid){
      alert('Invalid video Id ');
      return;
    }

    if(this.selectedSport == null || this.name == '' || this.matchPlayers.length == 0){
      alert('Debe elegir un deporte, jugadores e ingresar una descripción');
      return;
    }
    
    const {data: activeMatch, error:errorUpdating} = await this.DB.from('Matches').update({'active': false}).eq('active', true);
    if(errorUpdating){
      console.log(errorUpdating)
    }

    const newMatch = {
      sport: this.selectedSport,
      name: this.name,
      active: true,
      players: this.matchPlayers,
      year: this.ngdate.year,
      month: this.ngdate.month -1,
      day: this.ngdate.day,
      hour: this.hour,
      minutes: parseInt(this.minutes),
      videoPath:this.videoId,
      user_id: this.user_id
    }

    const {data, error} = await  this.DB.from('Matches').insert(
      newMatch
    ).single();

    if(error){
      alert('Cannot create match, check console') 
      console.log(error)
      return
    }

    this.router.navigate(['/'])

  }

  // private pad2(n: number) {
  //   return n < 10 ? '0' + n : n;
  // }

  // getDateAsString():string {
  //   const date= new Date();
  //   return (
  //     date.getFullYear().toString() +
  //     '-' +
  //     this.pad2(date.getMonth() + 1) +
  //     '-' +
  //     this.pad2(date.getDate()) +
  //     ' ' +
  //     this.pad2(date.getHours()) +
  //     ':' +
  //     this.pad2(date.getMinutes()) +
  //     ':' +
  //     this.pad2(date.getSeconds()));
  //   }
}



