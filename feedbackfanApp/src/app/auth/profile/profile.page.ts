import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileModel } from './profile.model';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    './styles/profile.page.scss',
    './styles/profile.shell.scss'
  ]
})
export class ProfilePage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;
  user: ProfileModel;

  @HostBinding('class.is-shell') get isShell() {
    return (this.user && this.user.isShell) ? true : false;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // On init, the route subscription is the active subscription
    this.subscriptions = this.route.data
    .subscribe(
      (resolvedRouteData: IResolvedRouteData<ProfileModel>) => {
        // Route subscription resolved, now the active subscription is the Observable extracted from the resolved route data
        this.subscriptions = ResolverHelper.extractData<ProfileModel>(resolvedRouteData.data, ProfileModel)
        .subscribe(
          (state) => {
            this.user = state;
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  }

  signOut() {
    this.authService.signOut().subscribe(() => {
      // Sign-out successful.
      // Replace state as we are no longer authorized to access profile page.
      Storage.clear();
      this.router.navigate(['auth/sign-in'], { replaceUrl: true });
    }, (error) => {
      console.log('signout error', error);
    });
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }
}
