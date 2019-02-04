import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck{


  constructor(private authService: AuthService)
  {}

  ngOnInit()
  {
    
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.

    let identity = this.authService.getIdentity()
    let stats = this.authService.getStats()

    this.authService.userLogued.next(identity)
    this.authService.userStats.next(stats)
  }
}
