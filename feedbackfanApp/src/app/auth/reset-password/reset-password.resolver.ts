import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordResolver implements Resolve<any> {
  isValidate: boolean;

  constructor(
    private atuhService: AuthService,
    private router: Router
  ) {}
  async resolve(route: ActivatedRouteSnapshot): Promise<boolean | string> {
    return await this.atuhService
      .verifyPasswordResetCode(route.queryParams.oobCode)
      .catch(() => this.router.navigate(['page-not-found'], { replaceUrl: true }));
  }
}
