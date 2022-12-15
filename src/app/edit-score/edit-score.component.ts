import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SportScore } from '../model/sportScore';
@Component({
  selector: 'app-edit-score',
  templateUrl: './edit-score.component.html',
})
export class EditScoreComponent implements OnInit {

  title:string
  score:SportScore
  newScoreValue: string=''
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {}

  addScoreValue(){
    if(this.newScoreValue.trim() != ''){
      if(this.score.type == '+/-'){
        this.score.values.push('+'+this.newScoreValue);
        this.score.values.push('-'+this.newScoreValue);
      }else{
        this.score.values.push(this.newScoreValue);
      }
    }
  }

  deleteScoreValue(valueIdx){
    this.score.values.splice(valueIdx,1);
  }


  OK(){
    if(this.score.name== '' )
    {
      alert("Name must be entered");
      return;
    }
    this.activeModal.close(this.score);
  }
}
