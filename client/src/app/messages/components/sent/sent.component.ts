import { Component, OnInit, DoCheck } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { FollowService } from 'src/app/user/follow.service';
import { MessageService } from '../../messages.service';
import { Message } from 'src/app/shared/message.model';
import { AuthService } from 'src/app/auth/auth.service';
import { server } from '../../../shared/server.url'

@Component({
    selector: 'sent',
    templateUrl: './sent.component.html'
})

export class SentComponent{
    private title: string
    private message: Message
    private identity
    private token
    private url
    private status
    private messages: Message[]
    private page: number
    private pages
    private total
    private next_page
    private prev_page


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private followService: FollowService,
        private messageService: MessageService,
        private authService: AuthService
    )
    {
        this.title = 'Sent Messages'
        this.identity = this.authService.getIdentity()
        this.token = this.authService.getToken()
        this.message = new Message('', '', '', this.identity._id, '','')
        this.url = server.url
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log('Sent component loaded')

        this.actualPage()
        
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
            this.getMessages(this.token, page)
        })
    }

    getMessages(token, page)
    {
        this.messageService.sentMessages(token, page).subscribe(
            response =>
            {
                if(response.messages)
                {
                    this.messages = response.messages
                    this.total = response.total
                    this.pages = response.pages
                }
            },
            error =>
            {
                console.log(<any> error)
            }
        )
    }
}   