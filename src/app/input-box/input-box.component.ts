import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'input-box',
  templateUrl: './input-box.component.html',
})
export class InputBoxComponent implements OnInit {

  title:string;
  label:string;
  inputValue:string;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {}

  OK(){
    if(this.inputValue== '' )
    {
      alert("Name must be entered");
      return;
    }
    this.activeModal.close(this.inputValue);

  }



}
