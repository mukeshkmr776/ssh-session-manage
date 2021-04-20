import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NodesComponent } from './pages/nodes/nodes.component';
import { SessionComponent } from './pages/session/session.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'nodes', component: NodesComponent },
  { path: 'sessions', component: SessionComponent },
  { path: '**', redirectTo: '/welcome'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
