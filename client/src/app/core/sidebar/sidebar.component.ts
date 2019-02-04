import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PublicationService } from 'src/app/user/publication.service';
import { server } from '../../shared/server.url'
import { Publication } from 'src/app/shared/publication.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/user/upload.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [UploadService]
})
export class SidebarComponent implements OnInit {
  public url: string
  public identity
  public token: string
  public stats: object
  public status: string
  public publication: Publication
  public filesToUpload: Array<File>

  sidebarForm = new FormGroup({
    textArea: new FormControl('', Validators.required),
    thinkingFile: new FormControl('')
  });

  constructor(
    private authService: AuthService, 
    private publicationService: PublicationService,
    private uploadService: UploadService,
    private router: Router
  ) 
  { 
    this.identity = this.authService.getIdentity()
    this.token = this.authService.getToken()
    this.url = server.url
    this.publication = new Publication('', this.identity._id,'','', '')
  }

  ngOnInit() {
    this.authService.userStats.subscribe(
      stats =>
      {
        this.stats = stats
      }
    )
  }

  onSubmit()
  {
    this.publication.text = this.sidebarForm.value.textArea
    this.publication.file = this.sidebarForm.value.thinkingFile

    this.publicationService.publicationSended.next({ sended: true })

    this.publicationService.addPublication(this.token, this.publication).subscribe(
      response =>
      {
        if(response.publication)
        {
          if(this.filesToUpload && this.filesToUpload.length)
          { 
            //Upload Image
            this.uploadService.makeFileRequest(
              this.url + '/upload-image-pub/'+ response.publication._id, 
              [], 
              this.filesToUpload,
              this.token,
              'image'
            )
            .then((result:any) =>
            {
              this.publication.file = result.image
              this.status = 'success'
              this.sidebarForm.reset()
              this.router.navigate(['/timeline'])
            })
          }
          else
          {
            this.status = 'success'
            this.sidebarForm.reset()
            this.router.navigate(['/timeline'])
          }
          
        }
        else
        {
          this.status = 'error'
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

  fileChangeEvent(fileInput: any)
  {
    this.filesToUpload = <Array <File>> fileInput.target.files
  }
}
