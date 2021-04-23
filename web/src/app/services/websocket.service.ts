import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class WebsocketService {

  EVENTS = {
    'MESSAGE': 'message',

    'GET_INFO': 'GET_INFO',
    'GET_HEALTH': 'GET_HEALTH',
    'EXECUTE_COMMAND': 'EXECUTE_COMMAND',
    'TERMINAL_OUTPUT': 'TERMINAL_OUTPUT',

    'START_SSH_STREAM': 'START_SSH_STREAM',
    'STOP_SSH_STREAM': 'STOP_SSH_STREAM',
    'OPEN_SSH_STREAM': 'OPEN_SSH_STREAM',
    'MSG_SSH_STREAM': 'MSG_SSH_STREAM',

    'SHUTDOWN_APPLICATION': 'SHUTDOWN_APPLICATION'
  };
  
  socketInstance = null

  constructor(private socket: Socket) {
    this.socketInstance = socket;
  }

  connectSocket() {
    this.socket.connect();
  }

  disconnectSocket() {
    this.socket.disconnect();
  }


  createMessage(key: string, message: any) {
    return {
      type: key,
      message: message
    }
  }

  sendMessage(key: string, message: any = '') {
    this.socket.emit('message', this.createMessage(key, message));
  }

  onEvent(key: string) {
    return this.socket.fromEvent(key).pipe(map((data: any) => data));
  }
}
