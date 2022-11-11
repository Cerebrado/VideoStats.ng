import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sport } from '../model/sport';
@Component({
  selector: 'app-new-sport',
  templateUrl: './new-sport.component.html'
})
export class NewSportComponent implements OnInit {

  sportName:string;

  constructor(public activeModal: NgbActiveModal) { }


  ngOnInit() {
  }

  OK(){
    const newSport = {};
    this.activeModal.close(newSport);
  }


}
