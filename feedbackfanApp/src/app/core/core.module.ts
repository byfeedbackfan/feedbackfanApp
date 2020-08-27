import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { LanguageService } from './language/language.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    UserService,
    LanguageService
  ],
})
export class CoreModule { }
