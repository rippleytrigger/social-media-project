import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

import { Follow } from '../shared/follow.model'

import { server } from '../shared/server.url'
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private url: string

  constructor(private http: HttpClient)
  {
    this.url = server.url
  }
  
  addFollow(token, follow): Observable <any>
  {
    let params = JSON.stringify(follow)
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token)
    
    return this.http.post(this.url + '/follow/', params, {headers})
  }

  deleteFollow(token, id): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token)
    
    return this.http.delete(this.url + '/follow/' + id, {headers})
  }

  getFollowing(token, userId = null, page = 1): Observable<any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                  .set('Authorization', token)

    let path =  this.url + '/following/' 

    if(userId != null)
    {
      path = this.url+'/following/'+userId+'/'+page
    }
    
    return this.http.get(path, {headers})                   
  }

  getFollowed(token, userId = null, page = 1): Observable<any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                  .set('Authorization', token)

    let path =  this.url + '/followed/' 

    if(userId != null)
    {
      path = this.url+'/followed/'+userId+'/'+page
    }
                                  
    return this.http.get(path, {headers})
  }

  getMyFollows(token): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                  .set('Authorization', token)

    return this.http.get(this.url + '/get-my-follows/true', {headers})
  }
}