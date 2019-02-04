import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './core/home/home.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UsersComponent } from './user/users/users.component';
import { TimelineComponent } from './user/timeline/timeline.component';
import { ProfileComponent } from './user/profile/profile.component';
import { FollowingComponent } from './user/following/following.component';
import { FollowedComponent } from './user/followed/followed.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'signin', component: LoginComponent},
  {path: 'signup', component: RegisterComponent},
  {path: 'my-data', component: UserEditComponent, canActivate: [AuthGuard]},
  {path: 'people', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'people/:page', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'following/:id/:page', component: FollowingComponent, canActivate: [AuthGuard]},
  {path: 'followed/:id/:page', component: FollowedComponent, canActivate: [AuthGuard]},
  {path: 'timeline', component: TimelineComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
