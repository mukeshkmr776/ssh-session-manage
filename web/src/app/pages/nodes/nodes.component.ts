import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  id: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', id: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', id: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', id: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', id: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', id: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', id: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', id: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', id: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', id: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', id: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.less']
})
export class NodesComponent implements OnInit {

  displayedColumns: string[] = ['name', 'id'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

  copyToClipboard(text:string) {
    // this.clipboard.copy('Alphonso');
  }

}
