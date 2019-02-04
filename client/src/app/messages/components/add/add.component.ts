import { Component, OnInit, DoCheck } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { FollowService } from 'src/app/user/follow.service';
import { MessageService } from '../../messages.service';
import { Message } from 'src/app/shared/message.model';
import { AuthService } from 'src/app/auth/auth.service';
import { server } from '../../../shared/server.url'
import { NgForm } from '@angular/forms';

@Component({
    selector: 'add',
    templateUrl: './add.component.html'
})

export class AddComponent implements OnInit{
    private title: string
    private message: Message
    private identity
    private token
    private url
    private status
    private follows

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private followService: FollowService,
        private messageService: MessageService,
        private authService: AuthService
    )
    {
        this.title = 'Send Message'
        this.identity = this.authService.getIdentity()
        this.token = this.authService.getToken()
        this.message = new Message('', '', '', this.identity._id, '','')
        this.url = server.url
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log('Add component loaded')
        this.getMyFollows()
    }
    
    getMyFollows()
    {
        this.followService.getMyFollows(this.token)
            .subscribe(
                response =>
                {
                    this.follows = response.follows
                    console.log(this.follows)
                },
                error =>
                {
                    console.log(<any> error)
                }
            )
    }

    onSubmit(form: NgForm)
    {
        this.messageService.addMessages(this.token, this.message)
        .subscribe(
            response =>
            {
                if(response.message)
                {
                    this.status = 'success'
                    form.reset()
                }
            },
            error =>
            {
                this.status = 'error'
                console.log(<any> error)
            }
        )   
    }
}