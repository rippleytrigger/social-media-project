import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UploadService } from '../upload.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../shared/user.model'

import { server } from '../../shared/server.url'

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  providers: [UploadService]
})
export class UserEditComponent implements OnInit {
  private identity
  private token
  private userEditForm: FormGroup
  private user: User
  private status
  private formSubmitted: boolean
  private url: string
  private filesToUpload: Array<File>

  constructor(
    private authService: AuthService,
    private uploadService: UploadService
  ) 
  {
    this.identity = this.authService.getIdentity()
    this.token = this.authService.getToken()
    this.user = this.identity

    this.url = server.url
  }

  ngOnInit() {
    this.userEditForm = new FormGroup({
      name: new FormControl(this.identity.name, Validators.required),
      surname: new FormControl(this.identity.surname, Validators.required),
      nick: new FormControl(this.identity.nick, Validators.required),
      email: new FormControl(this.identity.email, Validators.required),
    })
  }

  onSubmit() {
    this.user.name = this.userEditForm.value.name
    this.user.surname = this.userEditForm.value.surname
    this.user.nick = this.userEditForm.value.nick
    this.user.email = this.userEditForm.value.email

    this.formSubmitted = true

    this.authService.updateUser(this.user).subscribe(
      response =>
      {
        console.log(response)
        if(!response.user)
        {
          this.status = 'error'
        }
        else
        {
          this.status = 'success'
          localStorage.setItem('identity', JSON.stringify(this.user))

          //Upload Image
          this.uploadService.makeFileRequest(
            this.url + '/upload-image-user/' + this.user._id,
            [],
            this.filesToUpload,
            this.token,
            'image'
          ).then( (result: any) => {
            console.log(result)
            this.user.image = result.user.image
            localStorage.setItem('identity', JSON.stringify(this.user))
          })
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
    this.filesToUpload = <Array<File>>fileInput.target.files
  }
}
