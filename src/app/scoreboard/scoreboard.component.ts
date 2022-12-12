import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../model/match';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
})
export class ScoreboardComponent implements OnInit {

  constructor() { }

  private _activeMatch: Match;
  @Input() 
    set activeMatch(value: Match) {
    if (value) { //null check
        this._activeMatch = value;
        this.initResults();
    }
  }
  get activeMatch(): Match {
    return this._activeMatch;
  }

  results =  []
  selectedResultIdx = null

  initResults(){
    this.results.push(
      {team: 0,scores:[]},
      {team: 1,scores:[]},
    );
    let sIdx = -1;
    this.activeMatch?.sport.scores.forEach(score => {
      sIdx++;
      let firstValidValue = this.getScoreInitialValue(score);
      let newScore= {
        name: score.name,
        scoreIdx: sIdx,
        visible:true,
        slots: Array(score.slots).fill(firstValidValue)
      }

      this.results[0].scores.push(newScore);
      this.results[1].scores.push(newScore);
    });

  }

  getScoreInitialValue(score): string{
    if(score.sequence.length > 0){
      if(score.sequence[0].startsWith('+') || score.sequence[0].startsWith('-')){
        return '0';
      } 
      else
      {
        return score.sequence[0];
      }
    }
    else if(score.buttons.length > 0)
    {
      if(score.buttons[0].startsWith('+') || score.buttons[0].startsWith('-')){
        return '0';
      } 
      else
      {
        return score.buttons[0];
      }
    }
    return '';
  }

  setSequenceResult(mouseEvent:MouseEvent, teamIdx, scoreIdx, slotIdx){
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    if(!mouseEvent.ctrlKey)
      return;
    const currentValue = this.results[teamIdx].score[scoreIdx].slotIdx[slotIdx]
  }



  ngOnInit() {
  }

}
