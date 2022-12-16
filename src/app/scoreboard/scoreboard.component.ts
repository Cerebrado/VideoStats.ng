import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../model/match';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
})
export class ScoreboardComponent implements OnInit {

  constructor() { }

  
  ngOnInit() {
  }

  JSON = JSON;

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
  selectedResultIdxs =[-1,-1,-1]

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
      slots: Array(score.slots).fill(firstValidValue),
      valueIdx: 0,
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

  clickResult(mouseEvent:MouseEvent, teamIdx, scoreIdx, slotIdx){
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
    this.selectedResultIdxs =[teamIdx, scoreIdx, slotIdx]

    if(!this.activeMatch?.sport.scores[scoreIdx].showAsButtons)
    {
      this.setSequenceValue(mouseEvent, teamIdx, scoreIdx, slotIdx)
    }
  }

  setSequenceValue(mouseEvent:MouseEvent, teamIdx, scoreIdx, slotIdx){
    const scoreResult = this.results[teamIdx].scores[scoreIdx];
    const scoreDef = this.activeMatch.sport.scores[scoreIdx];

    if(scoreDef.type==='+/-'){
      if(!mouseEvent.ctrlKey){ //move to right
        scoreResult.slots[slotIdx] = (parseInt(scoreResult.slots[slotIdx])+1).toString();  
      }else {
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

  setResultValue(v:string){
    if(this.selectedResultIdxs[0] == -1){
      return;
    }

    const scoreResult = this.results[this.selectedResultIdxs[0]].scores[this.selectedResultIdxs[1]];
    const currentValue =  scoreResult.slots[this.selectedResultIdxs[2]]
    let increment = v.replace('+','').replace('-','');    
    if(v.startsWith('+'))
      scoreResult.slots[this.selectedResultIdxs[2]] = (parseInt(scoreResult.slots[this.selectedResultIdxs[2]]) + parseInt(increment)).toString();
    else if(v.startsWith('-'))
      scoreResult.slots[this.selectedResultIdxs[2]] = (parseInt(scoreResult.slots[this.selectedResultIdxs[2]]) - parseInt(increment)).toString();
    else
      scoreResult.slots[this.selectedResultIdxs[2]] = v;
  }
}
