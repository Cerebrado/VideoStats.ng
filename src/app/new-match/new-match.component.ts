import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseClient } from '@supabase/supabase-js';
import { Match } from '../model/match';
import { Player } from '../model/player';
import { Sport } from '../model/sport';
import { Place } from '../model/place';
import { SupabaseService } from '../supabase.service';
@Component({
  selector: 'new-match',
  templateUrl: './new-match.component.html',
})
export class NewMatchComponent {
  availablePlayersPerTeam: number[] =[1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22];

  sports: Sport[]=[];
  places: Place[]=[];
  players: Player[]=[];
  
  selectedSport: Sport | null
  selectedPlace: Place | null;
  matchPlayers: Player[] = []
  newPlayer:string = '';

  user_id: string
  DB: SupabaseClient
  constructor(private supaSvc: SupabaseService) { 
    this.DB = supaSvc.db;
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
      this.selectedSport = this.sports[0]
  }

  async getPlaces() {
    this.places =  await this.supaSvc.getMany('Places',`*`);
    if(this.places.length > 0)
      this.selectedPlace = this.places[0]
  }

  async getPlayers() {
    this.players=await this.supaSvc.getMany('Players',`*`);;
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

  //   deletePlayer(player:Player) {
  //   if(confirm('You will delete the player and statistics associated. Continue?'))
  //   {
  //     this.players = this.DB.removePlayer(player);
  //   }
  // }

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

  async btnConfirmNewMatchClick() {
    if(this.selectedSport == null || this.selectedPlace == null || this.matchPlayers.length == 0){
      alert('Debe elegir un deporte, un torneo y completar la cantidad de jugadores');
      return;
    }
    
    const {data: activeMatch, error:errorUpdating} = await this.DB.from('Matches').update({'active': false}).eq('active', true);
    if(errorUpdating){
      alert('Cannot finish previous match, check console') 
      console.log(errorUpdating)
    }

    const newMatch: Match = {
      date: new Date(),
      sportId: this.selectedSport.sportId,
      placeId: this.selectedPlace.placeId,
      active: true,
      players: this.matchPlayers,
      events: this.selectedSport.SportEvents,
      user_id: this.user_id
    }

    const {data, error} = await  this.DB.from('Matches').insert(
      newMatch
    ).single();

    if(error){
      alert('Cannot create match, check console') 
      console.log(error)
    }
  }
}
