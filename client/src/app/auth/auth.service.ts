import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';

import { User } from '../shared/user.model'

import { server } from '../shared/server.url'
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userLogued = new Subject()
  public userStats = new Subject()

  stats

  private url: string
  private token: string
  private identity

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) 
  { 
    this.url = server.url
  }

  signUpUser(userData: User): Observable<any>
  {
    let params = JSON.stringify(userData)

    let headers = new HttpHeaders().set('Content-type', 'application/json')

    return this.http.post(this.url + '/register', params, {headers})
  }

  signInUser(userData: User, gettoken = null): Observable<any>
  {
    if(gettoken != null)
    {
      userData.gettoken = gettoken
    }

    let params = JSON.stringify(userData)

    let headers = new HttpHeaders().set('Content-type', 'application/json')

    return this.http.post(this.url + '/login', params, {headers})
  }

  logoutUser()
  {
    localStorage.clear()
    this.identity = null
    this.token = null
    this.stats = null
    this.userLogued.next(this.identity)

    this.router.navigate(["/"])
  }

  getIdentity()
  {
    let identity = JSON.parse(localStorage.getItem('identity'))

    if(identity != undefined)
    {
      this.identity = identity
    }
    else
    {
      this.identity = null
    }

    return this.identity
  }

  getToken()
  {
    let token = localStorage.getItem('token')

    if(token != undefined)
    {
      this.token = token
    }
    else 
    {
      this.token = null
    }

    return this.token
  }

  getStats()
  {
    let stats = JSON.parse(localStorage.getItem('stats'))

    if(stats != undefined)
    {
      this.stats = stats
    }
    else
    {
      this.stats = null
    }

    return this.stats
  }

  getCounters(userId = null): Observable<any>
  {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken())

      if(userId != null)
      {
        return this.http.get(this.url + '/counters/' + userId, {headers: headers})
      }
      else
      {
        return this.http.get(this.url + '/counters/', {headers: headers})
      }
  }

  updateUser(user: User): Observable <any>
  {
    let params = JSON.stringify(user)

    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken())

    return this.http.put(this.url + '/update-user/' + user._id , params, {headers})
  }

  getUsers(page = null): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken())
    
    return this.http.get(this.url + '/users/' + page, {headers})
  }

  getUser(id): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', this.getToken())
    
    return this.http.get(this.url + '/user/' + id, {headers})
  }
}

