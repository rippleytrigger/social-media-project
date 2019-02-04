import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

import { MessagesRoutingModule } from './messages-routing.module'
import { MessageService } from './messages.service';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SentComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MessagesRoutingModule,
    MomentModule
  ],
  exports: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SentComponent,
  ],
  providers: [MessageService]
})
export class MessagesModule { }
