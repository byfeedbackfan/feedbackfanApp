import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
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
        loadChildren: () => import('../user-finder/user-finder.module').then(m => m.UserFinderModule)
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
