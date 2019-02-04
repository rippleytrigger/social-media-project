import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../publication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { server } from 'src/app/shared/server.url';
import { Publication } from 'src/app/shared/publication.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  public identity: object
  public user: object
  public token: string
  public url: string
  public status: string
  public total: number
  public page: number
  public pages: number
  public publications: Publication[]
  public itemsPerPage: number
  public showImage

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
    this.getPublications(this.page)

    // Refresh the timeline content
    this.publicationService.publicationSended.subscribe(
      response =>
      {
        this.getPublications(1)
      }
    )
  }

  getPublications(Page, adding = false)
  {
    this.publicationService.getPublications(this.token, Page)
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
   
    this.getPublications(this.page, true);
  } 

  refreshTimeline()
  {
    this.getPublications(1);
    this.noMore = false;
  }

  showPublicationImage(id)
  { 
    this.showImage = id
  }

  hidePublicationImage()
  { 
    this.showImage = 0
  }

  deletePublication(publicationId)
  {
    this.publicationService.deletePublication(this.token, publicationId)
      .subscribe(
        response =>
        {
          this.refreshTimeline()
        },
        error =>
        {
          console.log(<any> error)
          this.status = 'error'
        }
      )
  }
}

