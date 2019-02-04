import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

import { User } from '../../shared/user.model'
import { server } from '../../shared/server.url'
import { FollowService } from '../follow.service';
import { Follow } from 'src/app/shared/follow.model';
import { identity } from 'rxjs';
import { Publication } from 'src/app/shared/publication.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private identity
  private token
  private next_page
  private prev_page
  private page
  private pages: number
  private total: number
  private users: User[]
  private status: string
  private url: string
  private follows: any[]

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
      this.getUsers(page)
    })
  }

  getUsers(page)
  {
    this.authService.getUsers(page).subscribe(
      response => {
        if(!response.users)
        {
          this.status = 'error'
        }
        else
        {
          this.total = response.total
          this.users = response.users
          this.pages = response.pages
          this.follows = response.userFollowing

          console.log(this.follows)
          
          if(page > this.pages)
          {
            this.router.navigate(['/'])
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
}
