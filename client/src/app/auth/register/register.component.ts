import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signUpUserSubscription

  formSubmitted: boolean
  validSignUp: boolean
  user: User

  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) 
  { 
    this.user = new User('','', '', '','', '', '', 'ROLE_USER', '')
  }

  ngOnInit() {
  }

  onSubmit()
  {
    this.user.name = this.signupForm.value.name
    this.user.surname = this.signupForm.value.surname
    this.user.nick = this.signupForm.value.nickname 
    this.user.email = this.signupForm.value.email
    this.user.password =  this.signupForm.value.password
   
    this.formSubmitted = true

    this.signUpUserSubscription = this.authService.signUpUser(this.user).subscribe(
      (response) =>
      {
        if(response.user && response.user._id)
        {
          this.validSignUp = true
        }
      },
      error => 
      {
        this.validSignUp = false
      }
    )
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this.signUpUserSubscription.unsubscribe()
  }

}
