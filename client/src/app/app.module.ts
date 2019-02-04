import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MessagesModule } from './messages/messages.module'

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './core/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from './auth/auth.service';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UsersComponent } from './user/users/users.component';
import { FollowService } from './user/follow.service';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { TimelineComponent } from './user/timeline/timeline.component';
import { MomentModule } from 'angular2-moment';
import { PublicationService } from './user/publication.service';
import { ProfileComponent } from './user/profile/profile.component';
import { PublicationsComponent } from './user/publications/publications.component';
import { FollowingComponent } from './user/following/following.component';
import { FollowedComponent } from './user/followed/followed.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    ProfileComponent,
    PublicationsComponent,
    FollowingComponent,
    FollowedComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MessagesModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentModule,
  ],
  providers: [AuthService, FollowService, PublicationService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
