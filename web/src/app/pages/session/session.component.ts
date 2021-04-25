import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Terminal } from "xterm";

import { WebsocketService } from 'src/app/services';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.less']
})
export class SessionComponent implements OnInit, OnDestroy, AfterViewInit {

  isConnected: boolean = false;
  subscription: Subscription = null;
  term: Terminal;

  @ViewChild('myTerminal') terminalDiv: ElementRef;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.registerWebSocketEvents();
    this.term = new Terminal();
  }

  connect() {
    if (this.isConnected) {
      console.log('already connected');
      return;
    }
    this.websocketService.connectSocket();
    const host     = 'localhost';
    const username = 'mukki';
    const password = 'mukki';
    this.websocketService.sendMessage(this.websocketService.EVENTS.START_SSH_STREAM, {host, username, password});
  }

  disconnect() {
    this.isConnected = false;
    this.websocketService.disconnectSocket();
  }

  registerWebSocketEvents() {
    this.websocketService.onEvent(this.websocketService.EVENTS.OPEN_SSH_STREAM).subscribe((message) => {
      console.log(message);
      this.isConnected = true;
    });
    this.websocketService.onEvent(this.websocketService.EVENTS.STOP_SSH_STREAM).subscribe((message) => {
      this.isConnected = false;
      this.websocketService.disconnectSocket();
    });
    this.websocketService.onEvent(this.websocketService.EVENTS.MSG_SSH_STREAM).subscribe((message) => {
      if (!this.isConnected) {
        return;
      }
      this.term.write(message);
    });
  }

  ngAfterViewInit() {
    this.term.open(this.terminalDiv.nativeElement);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
