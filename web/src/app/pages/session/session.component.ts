import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.less']
})
export class SessionComponent implements OnInit, OnDestroy {

  isConnected: boolean = false;
  subscription: Subscription = null;
  data: string = '';

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.registerWebSocketEvents();
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

  clearTerminal() {
    this.data = '';
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
      message = message.replace('\r\n', '\n');
      this.data += message;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
