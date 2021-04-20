import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angu;ar.material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NodesComponent } from './pages/nodes/nodes.component';
import { SessionComponent } from './pages/session/session.component';
import { MenuComponent } from './pages/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NodesComponent,
    SessionComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
