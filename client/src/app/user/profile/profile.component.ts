import { Component, OnInit } from '@angular/core';
import { server } from 'src/app/shared/server.url'
import { AuthService } from 'src/app/auth/auth.service';
import { FollowService } from '../follow.service';
import { User } from 'src/app/shared/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Follow } from 'src/app/shared/follow.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public identity
  public token: string 
  public url: string
  public status: string
  public user: User
  public stats: object
  public followed
  public following

  constructor(
    private authService: AuthService,
    private followService: FollowService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) 
  { 
    this.url = server.url
    this.identity = this.authService.getIdentity()
    this.token = this.authService.getToken()
    this.followed = false
    this.following = false
  }

  ngOnInit() {
    this.loadPage()
  }

  loadPage()
  {
    this.activatedRouter.params.subscribe( params =>
      {
        let id = params['id']

        this.getUser(id)
        this.getCounters(id)
      }
    )
  }

  getUser(id)
  {
    this.authService.getUser(id)
      .subscribe(
        response =>
        {
          if(response.user)
          {
            this.user = response.user

            if(response.following && response.following._id)
            {
              this.following = true
            }
            else
            {
              this.following = false
            }

            if(response.followed && response.followed._id)
            {
              this.followed = true
            }
            else
            {
              this.followed = false
            }
          }
          else
          {
            this.status = 'error'
          }
        },
        error =>
        {
          console.log(<any>error)
          this.router.navigate(['/profile', this.identity._id])
        }
      )
  }

  getCounters(id)
  {
    this.authService.getCounters(id).subscribe(
      response =>
      {
        this.stats = response 
      },
      error =>
      {
        console.log(<any> error)
      }
    )
  }

  followUser(followed)
  {
    let follow = new Follow('', this.identity._id, followed)

    this.followService.addFollow(this.token, follow)
      .subscribe(
        response =>
        {
          this.following = true
        },
        error =>
        {
          console.log(<any> error)
        }
      )
  }

  unFollowUser(followed)
  {
    this.followService.deleteFollow(this.token, followed)
      .subscribe(
        response =>
        {
          this.following = false
        },
        error =>
        {
          console.log(<any> error)
        }
      )
  }
}
