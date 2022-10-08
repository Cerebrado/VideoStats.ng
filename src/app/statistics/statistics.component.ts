import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../Model/Match.service';
import { DBService } from '../Model/DB.service';
import { Match, PlayerEventPosition } from '../Model/Match';
import { Sport } from '../Model/Sport';
import { Tournament } from '../Model/Tournament';
import { ForwardRefHandling } from '@angular/compiler';



@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})

export class StatisticsComponent implements OnInit {
  sports: Sport[];
  selectedSportId: string = '0';

  tournaments: Tournament[];
  selectedTournamentId: string = '0';

  groupBy: number=19;
  statType: string = 'byPlayer';

  matches: Match[]= [];
  

  //each square will have one Event, many matches (x-Axis), many players (series) with count (serie data). 
  //                                  Event       match       players count
  EventByMatchesWithPlayersCount: Map<string, Map<string, Map<string, number>>>;
  
  constructor(private matchSvc: MatchService, private DB:DBService ) {  }

  ngOnInit() {
    this.DB.getSports().subscribe({
      next: (result) => {this.sports = result
        if(this.sports.length > 0)
          this.onSportChanged(this.sports[0].sportId);
      },
      error: (error) => {
        alert('Cannot get Sports, check console'); 
        console.log(error);
      }
    });
  }

  onSportChanged(sportId: string){
    this.selectedSportId = sportId;
    this.matches = this.matchSvc.getHistory(sportId);
    let cm = this.matchSvc.getCurrent(); 
    if(cm != null)
      this.matches.push(cm);

    this.tournaments = this.DB.getTournaments(sportId);
    if(this.tournaments.length > 0) {
      this.onTournamentChanged(this.tournaments[0].tournamentId);
    } else{
      this.onTournamentChanged('0');
    }
  }  

  onTournamentChanged(tournamentId : string){
    this.selectedTournamentId = tournamentId;
    this.buildStats();
  }

  onGroupByChanged(cutDate: string){
    this.groupBy = parseInt(cutDate);
    this.buildStats();
  }

  onStatsTypeChanged(statType:string)
  {
    this.statType = statType;
    this.buildStats();
  }


  buildStats(){
    this.EventByMatchesWithPlayersCount = new Map<string, Map<string, Map<string, number>>>();

    let matches: Match[];
    if(this.selectedTournamentId == '0'){
      matches = this.matches;
    } else {
      matches = this.matches.filter(x=>x.tournamentId == this.selectedTournamentId);
    }
    
    let events = matches.map(x=> new GameAndEvents(x.date.substring(0,this.groupBy), x.events));

    events.forEach(match=>{
      match.events.forEach( playerEvent => {
        if(!this.EventByMatchesWithPlayersCount.has(playerEvent.event.short))
          this.EventByMatchesWithPlayersCount.set(playerEvent.event.short, new Map<string, Map<string, number>>());
        if(!this.EventByMatchesWithPlayersCount.get(playerEvent.event.short).has(match.date))
          this.EventByMatchesWithPlayersCount.get(playerEvent.event.short).set(match.date, new Map<string, number>());
        if(!this.EventByMatchesWithPlayersCount.get(playerEvent.event.short).get(match.date).has(playerEvent.player.nick))
          this.EventByMatchesWithPlayersCount.get(playerEvent.event.short).get(match.date).set(playerEvent.player.nick, 0);
        this.EventByMatchesWithPlayersCount.get(playerEvent.event.short).get(match.date).set(playerEvent.player.nick,
          this.EventByMatchesWithPlayersCount.get(playerEvent.event.short).get(match.date).get(playerEvent.player.nick) + 1
        );
      })
    })
  }
}

export class GameAndEvents{
  date: string;
  events: PlayerEventPosition [];

  constructor(date:string, events:PlayerEventPosition []){
    this.date = date;
    this.events = events;
  }
}