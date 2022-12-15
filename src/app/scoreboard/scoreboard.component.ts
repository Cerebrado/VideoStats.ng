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
    this.activeMatch?.sport.scores.forEach(score => {
      
      this.results[0].scores.push(this.getNewResultScore(score));
      this.results[1].scores.push(this.getNewResultScore(score));
    });
  }

  getNewResultScore(score){
    let firstValidValue = this.getScoreInitialValue(score);
      return {
      name: score.name,
      visible: score.visibleAtBeggining,
      slots: Array(score.slots).fill(firstValidValue),
      valueIdx: 0
    }
  }

  getScoreInitialValue(score): string{
    if(score.type==='+/-'){
      return '0';
    } 
    
    if(score.values.length === 0){
      alert('Score ' + score.name + ' is of type [values] but not values were found');
      return '';
    }
    return score.values[0];
  }

  setResult(mouseEvent:MouseEvent, teamIdx, scoreIdx, slotIdx, valueToSet){
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    const scoreDef = this.activeMatch.sport.scores[scoreIdx];
    const scoreResult = this.results[teamIdx].scores[scoreIdx];
    if(valueToSet){
      scoreResult.slots[slotIdx] = valueToSet;
      return;
    }

    //it's a sequence
      if(scoreDef.type==='+/-'){
        if(!mouseEvent.ctrlKey){ //move to right
          scoreResult.slots[slotIdx] = (parseInt(scoreResult.slots[slotIdx])+1).toString();  
        }else if(scoreResult.slots[slotIdx] > 0) {
          scoreResult.slots[slotIdx] = (parseInt(scoreResult.slots[slotIdx])-1).toString();  
        }
      } else{ //type 'values'
        if(!mouseEvent.ctrlKey){ //move to right
          if(scoreResult.valueIdx === scoreDef.values.length-1){
            scoreResult.valueIdx = 0;
          }else{
            scoreResult.valueIdx = scoreResult.valueIdx +1;
          }
        }else{ //move to left
          if(scoreResult.valueIdx === 0){
            scoreResult.valueIdx = scoreDef.values.length-1
          }else{
            scoreResult.valueIdx = scoreResult.valueIdx -1
          }
        }
        scoreResult.slots[slotIdx] = scoreDef.values[scoreResult.valueIdx];
      }
  }



  ngOnInit() {
  }

}
