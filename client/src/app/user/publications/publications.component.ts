import { Component, OnInit, Input } from '@angular/core';
import { Publication } from 'src/app/shared/publication.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../publication.service';
import { AuthService } from 'src/app/auth/auth.service';

import { server } from 'src/app/shared/server.url'

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {

  public identity: object
  public token: string
  public url: string
  public status: string
  public total: number
  public page: number
  public pages: number
  public publications: Publication[]
  public itemsPerPage: number
  @Input() public user: string

  constructor( 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private publicationService: PublicationService,
    private authService: AuthService
  ) 
  { 
    this.identity = this.authService.getIdentity()
    this.token = this.authService.getToken()
    this.url = server.url
    this.page = 1
    this.publications = []
  }

  ngOnInit() {
    this.getPublications(this.user, this.page)

    // Refresh the timeline content
    this.publicationService.publicationSended.subscribe(
      response =>
      {
        this.getPublications(this.user, 1)
      }
    )
  }

  getPublications(user, Page, adding = false)
  {
    this.publicationService.getPublicationsUser(this.token, Page, user)
      .subscribe(
        response =>
        {
          if(response.publications)
          {
            this.total = response.totalItems
            this.pages = response.pages
            this.itemsPerPage = response.itemsPerPage

            if(!adding)
            {
              this.publications = response.publications
            }
            else
            {
              let arrayA = this.publications
              let arrayB = response.publications

              this.publications = arrayA.concat(arrayB)

              // JQuery
              $("html, body").animate({ scrollTop: $("body").prop("scrollHeight")}, 500)
            }
          }
          else
          {
            this.status = 'error'
          }
        },
        error => 
        {
          let errorMessage = <any>error
          console.log(errorMessage)

          if(errorMessage != null)
          {
            this.status = 'error'
          }
        }
      )
  }

  private noMore = false
  viewMore()
  {
    this.page += 1;

    if(this.page == this.pages)
    {
      this.noMore = true
    }
    
    this.getPublications(this.user, this.page, true);
  } 

  refreshTimeline()
  {
    this.getPublications(this.user, 1);
    this.noMore = false;
  }
}




