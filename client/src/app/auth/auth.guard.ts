import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(
        public router: Router,
        public authService: AuthService
    ) { }

    canActivate() {
        let identity = this.authService.getIdentity()

        if(identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN'))
        {
            return true
        }
        else
        {
            this.router.navigate(['/signin'])
            return false
        }
    }
}