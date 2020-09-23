import { Injectable } from '@angular/core';
import { LanguageModel } from './language.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  languages: Array<LanguageModel> = new Array<LanguageModel>();

   constructor( private translateService: TranslateService) {
     this.languages.push(
      { name: 'Spanish', code: 'es' },
     );
   }

   public getLanguages() {
     return this.languages;
   }

   public getTerm(key: string): string {
     let term;
     this.translateService.get(key).subscribe((value) => {
       term = value;
     });
     return term;
   }

 }
