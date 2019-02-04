import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FollowService } from '../follow.service';
import { server } from '../../shared/server.url'
import { Follow } from 'src/app/shared/follow.model';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {

  public identity
  public token
  public next_page
  public prev_page
  public page
  public pages: number
  public total: number
  public users: User[]
  public status: string
  public url: string
  public follows: any[]
  public following
  public userPageId
  public user: User

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private followService: FollowService
  ) 
  { 
    this.url = server.url
    this.token = this.authService.getToken()
  }

  ngOnInit() {
    this.actualPage()

    this.authService.userLogued.subscribe(
      identity => this.identity = identity
    )
  }

  actualPage()
  {
    this.activatedRoute.params.subscribe(params => {
      let page = +params['page']
      this.page = page

      let userId = params['id']

      this.userPageId = userId

      if(!params['page'])
      {
        page = 1
      }

      if(!page)
      {
        page = 1
      }
      else
      {
        this.next_page = page + 1
        this.prev_page = page - 1

        if(this.prev_page <= 0)
        {
          this.prev_page = 1
        }
      }

      // Return user list
      this.getUser(userId, page)
    })
  }

  getFollows(userId, page)
  {
    this.followService.getFollowing(this.token, userId, page).subscribe(
      response => {
        if(!response.follows)
        {
          this.status = 'error'
        }
        else
        { 
          this.total = response.total
          this.following = response.follows
          this.pages = response.pages
          this.follows = response.userFollowing
          
          if(page > this.pages)
          {
            this.router.navigate(['/people', 1])
          }
        }
      },
      error =>
      {
        let errorMessage = <any> error
        console.log(errorMessage)

        if(errorMessage != null)
        {
          this.status = 'error'
        }
      }
    )
  }

  private followUserOver
  onMouseEnter(userId)
  {
    this.followUserOver = userId
  }

  onMouseLeave(userId)
  {
    this.followUserOver = 0
  }

  followUser(followed)
  {
    let follow = new Follow('', this.identity._id, followed)

    this.followService.addFollow(this.token,follow).subscribe(
      response => 
      {
        if(!response.follow)
        {
          this.status = 'error'
        }
        else
        {
          this.status = 'success'
          this.follows.push(followed)
        }
      },
      error =>
      {
        let errorMessage = <any> error
        
        console.log(errorMessage)

        if(errorMessage != null)
        {
          this.status = 'error'
        }
      }
    )
  }

  unFollowUser(followed)
  {
    this.followService.deleteFollow(this.token, followed).subscribe(
      response =>
      {
        let search = this.follows.indexOf(followed)

        if(search != -1)
        {
          this.follows.splice(search, 1)
        }
      },
      error =>
      {
        let errorMessage = <any> error

        if(errorMessage != null)
        {
          this.status = 'error'
        }
      }
    )
  }

  getUser(userId, page)
  {
    this.authService.getUser(userId).subscribe
    (
      response =>
      {
        if(response.user)
        {
          this.user = response.user
          this.getFollows(userId, page)
        }
        else
        {
          this.router.navigate(['/home'])
        }
      },
      error =>
      {
        let errorMessage = <any> error

        if(errorMessage != null)
        {
          this.status = 'error'
        }
      }
    )
  }
}

