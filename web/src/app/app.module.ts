import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular.material';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { NodesComponent } from './pages/nodes/nodes.component';
import { SessionComponent } from './pages/session/session.component';
import { MenuComponent } from './pages/menu/menu.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WelcomeComponent } from './pages/welcome/welcome.component';

import { WebsocketService } from './services';

const ws_config: SocketIoConfig = { url: location.origin, options: {path: '/ws', reconnect: true} };
@NgModule({
  declarations: [
    AppComponent,
    NodesComponent,
    SessionComponent,
    MenuComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(ws_config),
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
