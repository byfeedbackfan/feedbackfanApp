import { Pipe, PipeTransform } from '@angular/core';
import { ProfileModel } from '../../profile/profile.model';

@Pipe({
  name: 'filterSearch'
})
export class FilterSearchPipe implements PipeTransform {

  transform(array: ProfileModel[], text: string, columnOne: string, columnTwo): any [] {
    if ( text === '' ) {
      return array;
    }

    text = text.toLowerCase();

    return array.filter( item => {
      return item[columnOne].toLowerCase().includes(text) ||
             item[columnTwo].toLowerCase().includes(text);
    });
  }

}
