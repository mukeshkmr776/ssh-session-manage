import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {

  @ViewChild('sampleTemplate', {static: true}) sampleTemplate;

  constructor(private _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
  }

  openBottomSheet() {
    this._bottomSheet.open(this.sampleTemplate, {
      panelClass: 'mukki'
    });
  }

}
