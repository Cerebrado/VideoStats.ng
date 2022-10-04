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

  @Input() rows: any = 4;
  @Input() cols: any = 3;

  rowCells = [];
  colCells = [];

  @Input() orientation: string = 'H';

  calculateCourtcells() {
    this.rowCells.splice(0);
    this.colCells.splice(0);

    let rowLimit = this.rows;
    let colLimit = this.cols;
    
    if(this.orientation == 'H')
    {
       colLimit *= 2;
    }
    else{
      rowLimit *= 2;;
    }
    for (let i = 1; i <= rowLimit; i++) {
      this.rowCells.push(i);
    }
    for (let i = 1; i <= colLimit; i++) {
      this.colCells.push(i);
    }
  }

  cellClicked(row, col) {}

  calculateCellStyle(i, j) {
    var style = {
      border: '1px dotted black',
    };

    if (this.orientation == 'H' && j == 4) {
      style['border-right'] = '4px solid black';
    } else if (this.orientation == 'V' && i == 4) {
      style['border-bottom'] = '4px solid black';
    }

    style['width'] = '50px';
    style['height'] = '50px';

    return style;
  }

  CalculateCellClass(i, j) {
    if (this.orientation == 'H' && j == this.cols) {
      return 'squareRightBorderBold';
    } else if (this.orientation == 'V' && i == this.rows) {
      return 'squareBottomBorderBold';
    }

    return 'square';
  }
}
