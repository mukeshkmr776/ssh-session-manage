import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NodesComponent } from './pages/nodes/nodes.component';
import { SessionComponent } from './pages/session/session.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'sessions', component: SessionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
