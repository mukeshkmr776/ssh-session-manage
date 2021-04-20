import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  headerOptions: Array<object> = [
    { name: 'Home', url: '/home' },
    { name: 'ClusterView', url: '/view/5' }
  ];

  active = true;

  constructor() { }

  ngOnInit() { }

}