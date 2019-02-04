import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User
  status: string
  identity;
  token: string;

  formSubmitted: boolean
  validSignin: boolean

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) 
  { 
    this.user = new User('', '', '', '','', '', '', 'ROLE_USER', '')
  }

  ngOnInit() {
  }

  onSubmit()
  {
    this.user.email = this.signinForm.value.email
    this.user.password = this.signinForm.value.password

    this.formSubmitted = true 

    // Signin user
    this.authService.signInUser(this.user).subscribe(
      response =>
      {
        this.identity = response.user
  
        if(!this.identity || !this.identity._id)
        {
          this.status = 'error'
        }
        else
        {
          // Persist user data
          localStorage.setItem('identity', JSON.stringify(this.identity))

          // Get token
          this.getToken()
        }
      },
      error =>
      {
        const errorMessage = <any> error

        console.log(errorMessage)

        if(errorMessage != null)
        {
          this.status = 'error'
        }
      }
    )

  }

  getToken()
  {
    this.authService.signInUser(this.user, true).subscribe(
      response =>
      {
        this.token = response.token
    
        if(this.token.length <= 0)
        {
          this.status = 'error'
        }
        else
        {
          // Persist user data
          localStorage.setItem('token', this.token)
    
          // Get counters or stadistics from user
          this.onGetCounters()
        }
      },
      error =>
      {
        const errorMessage = <any> error
    
        console.log(errorMessage)
    
        if(errorMessage != null)
        {
          this.status = 'error'
        }
      }
    )
  }

  onGetCounters()
  {
    this.authService.getCounters(this.identity._id).subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response))

        this.status = 'success'

        this.router.navigate(["/"])
      },
      error => {
        console.log(error)
      }
    )
  }
}
