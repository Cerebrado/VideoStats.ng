import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
})
export class CourtComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.calculateCourtcells();
  }

  @Input() rows: number = 4;
  @Input() cols: number = 6;
  @Input() orientation: string = 'H';

  rowCells = [];
  colCells = [];


  calculateCourtcells() {
    this.rowCells.splice(0);
    this.colCells.splice(0);

    for (let i = 1; i <= this.rows; i++) {
      this.rowCells.push(i);
    }
    for (let i = 1; i <=this.cols; i++) {
      this.colCells.push(i);
    }
  }

  cellClicked(row, col) {}

  calculateCellStyle(i, j) {
    var style = "border: 1px dotted black;"
    

    if (this.orientation == 'H' && j == this.cols/2) {
      style += "border-right: 4px solid black;"
    } else if (this.orientation == 'V' && i == this.rows/2) {
      style += "border-bottom: 4px solid black;"
    }
     style += "width: 50px;height: 50px;"

    return style;
  }

  CalculateCellClass(i, j) {
    if (this.orientation == 'H' && j == this.cols-1) {
      return 'squareRightBorderBold';
    } else if (this.orientation == 'V' && i == this.rows -1) {
      return 'squareBottomBorderBold';
    }

    return 'square';
  }
}
