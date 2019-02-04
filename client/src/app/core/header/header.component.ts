import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import { server } from '../../shared/server.url'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit {
  title: string
  url: string
  identity

  constructor(private authService: AuthService) {
    this.title = 'Redex'
  }

  ngOnInit() {
    this.authService.userLogued.subscribe(
      (identity) =>
      {
        this.identity = identity
      }
    )

    this.url = server.url
  }

  onLogout() 
  {
    this.authService.logoutUser()
  }
}
