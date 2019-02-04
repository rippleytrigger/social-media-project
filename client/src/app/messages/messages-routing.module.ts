import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {path: 'messages', component: MainComponent, canActivate: [AuthGuard], children: [
    {path: '', redirectTo: 'received', pathMatch: 'full' },
    {path: 'send', component: AddComponent},
    {path: 'received', component: ReceivedComponent},
    {path: 'received/:page', component: ReceivedComponent},
    {path: 'sent', component: SentComponent},
    {path: 'sent/:page', component: SentComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
