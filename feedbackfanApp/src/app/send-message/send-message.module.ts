import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendMessagePage } from './send-message.page';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { UserSearchComponent } from './user-search/user-search.component';
import { ShellModule } from '../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: SendMessagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShellModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered'}, { list: 'bullet' }],
        [{ script: 'sub'}, { script: 'super' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
      ]
      },
      placeholder: 'Inserta el mensaje...',
      theme: 'snow'
    }),
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
  ],
  declarations: [
    SendMessagePage,
    UserSearchComponent,
  ],
})
export class SendMessageModule {}
