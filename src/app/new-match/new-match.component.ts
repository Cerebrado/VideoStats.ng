import {  Component, ElementRef, ViewChild} from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Match } from '../model/match';
import { Player } from '../model/player';
import { Sport } from '../model/sport';
import { Place } from '../model/place';
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


  videoPlayer: HTMLVideoElement;
  @ViewChild('videoPlayer')
  set mainVideoEl(el: ElementRef) {
    this.videoPlayer = el.nativeElement;
  }


  sports: Sport[]=[];
  places: Place[]=[];
  availablePlayers: Player[]=[];
  
  selectedSport: Sport 
  name: string = ''
  ngdate: NgbDate
  hour: number 
  minutes: string = '00' 
  matchPlayers: Player[] = []
  videoPath:string = 'https://www.w3schools.com/html/mov_bbb.mp4'

  newPlayer:string = ''
  searchPlayer:string = ''
  videoLoaded = false;

  user_id: string
  DB: SupabaseClient

  async ngOnInit() {
    const today = new Date();
    this.ngdate = new NgbDate(today.getFullYear(), today.getMonth() + 1,today.getDate());
    this.hour = today.getHours(),
    await this.getSports();
    await this.getAvailablePlayers();
  }

  async getSports() {
    this.sports = await this.supaSvc.getMany('Sports',`*, SportEvents: Events(*)`);

    if(this.sports.length > 0)
      this.selectedSport = this.sports[0]
  }

  async getAvailablePlayers() {
    this.availablePlayers=await this.supaSvc.getMany('Players',`*`);;
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
    if(this.matchPlayers.some(x=>x.playerId == p.playerId)){
      alert(p.name + ' ya fue agregado y no puede jugar por dos. No es tan bueno.')
      return;
    }

    this.matchPlayers.push(p);
  }
  
  unconfirmPlayer(p: Player) {
    let idx = this.matchPlayers.findIndex(x=>x.playerId === p.playerId);
    if(idx > -1 )
      this.matchPlayers.splice(idx, 1);
  }

  async loadVideo() {
    this.videoLoaded =true;
    this.videoPlayer.src=this.videoPath;
    this.videoPlayer.load();
  }

  onvideoError(e){
    this.videoLoaded = false;
  }

  async btnConfirmNewMatchClick() {
    if(this.selectedSport == null || this.name == '' || this.matchPlayers.length == 0){
      alert('Debe elegir un deporte, e ingresar un nombre y jugadores');
      return;
    }
    
    const {data: activeMatch, error:errorUpdating} = await this.DB.from('Matches').update({'active': false}).eq('active', true);
    if(errorUpdating){
      console.log(errorUpdating)
    }

    const newMatch: Match = {
      matchId: 0,
      sportId: this.selectedSport.sportId,
      name: this.name,
      active: true,
      players: this.matchPlayers,
      events: this.selectedSport.SportEvents,
      year: this.ngdate.year,
      month: this.ngdate.month -1,
      day: this.ngdate.day,
      hour: this.hour,
      minutes: parseInt(this.minutes),
      videoPath:this.videoPath,
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



