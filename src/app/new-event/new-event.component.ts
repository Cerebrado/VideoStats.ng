import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SportEvent } from '../model/sportEvent';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'new-event',
  templateUrl: './new-event.component.html',
})
export class NewEventComponent {

  constructor(public activeModal: NgbActiveModal) {}

  sportId:string
  name: string = ''
  balance: string = "0"

  btnSaveNewEventClick() {
    if(this.name == '' )
    {
      alert("Name must be entered")
      return;
    }
    const playEvent = {sportId: this.sportId, name: this.name, balance: this.balance}
    this.activeModal.close(playEvent);
  }

}
