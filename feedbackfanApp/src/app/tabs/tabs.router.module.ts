import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsPage } from './tabs.page';
import { TabsGuard } from './tabsguard';
import { TabsResolver } from './tabs.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [TabsGuard],
    resolve: {
      data: TabsResolver,
    },
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'send-message',
        loadChildren: () => import('../send-message/send-message.module').then(m => m.SendMessageModule)
      },
      {
        path: 'sended-message',
        loadChildren: () => import('../sended-message/sended-message.module').then(m => m.SendedMessageModule)
      },
      {
        path: 'received-message',
        loadChildren: () => import('../received-message/received-message.module').then(m => m.ReceivedMessageModule)
      },
      {
        path: 'user-finder',
        loadChildren: () => import('../user-finder/user-finder.module').then(m => m.UserFinderModule),
      },
      {
        path: 'change-jobs',
        loadChildren: () => import('../change-jobs/change-jobs.module').then(m => m.ChangeJobsModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../user-found/user-found.module').then(m => m.UserFoundModule)
      },
      {
        path: 'workers-to-supervisor',
        loadChildren: () => import('../workers-to-supervisors/workers-to-supervisors.module').then(m => m.WorkersToSupervisorsModule)
      },
      {
        path: 'employees-in-charge',
        loadChildren: () => import('../employees-in-charge/employees-in-charge.module').then(m => m.EmployeesInChargeModule)
      },
      {
        path: 'user-ranking',
        loadChildren: () => import('../user-ranking/user-ranking.module').then( m => m.UserRankingModule)
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsRoutingModule {}
