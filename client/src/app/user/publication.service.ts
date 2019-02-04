import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { server } from '../shared/server.url'

@Injectable()
export class PublicationService {
  url: string
  publicationSended = new Subject()

  constructor(private http: HttpClient) 
  { 
    this.url = server.url
  }

  addPublication(token, publication): Observable <any>
  {
    let params = JSON.stringify(publication)
    
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token)

    return this.http.post(this.url + '/publication/', params, {headers})
  }

  getPublications(token, page = 1): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token)

    return this.http.get(this.url + '/publications/' + page, {headers})
  }

  getPublicationsUser(token, page = 1, userid): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token)

    return this.http.get(`${this.url}/publications-user/${userid}/${page}`, {headers})
  }

  deletePublication(token, id): Observable <any>
  {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token)

    return this.http.delete(this.url + '/publication/'+ id, {headers})
  }
}
