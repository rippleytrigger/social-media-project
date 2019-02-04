import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../shared/user.model'
import { server } from '../shared/server.url'

@Injectable()
export class MessageService{
    private url: string

    constructor(private http: HttpClient)
    {
        this.url = server.url
    }

    addMessages(token, messages): Observable <any>
    {
        let params = JSON.stringify(messages)

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token)

        return this.http.post(this.url + '/message/',params, {headers})
    }

    getMyMessages(token, page = 1): Observable <any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token)

        return this.http.get(this.url + '/my-messages/' + page, {headers})
    }

    sentMessages(token, page = 1): Observable <any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token)

        return this.http.get(this.url + '/messages/' + page, {headers})
    }
}