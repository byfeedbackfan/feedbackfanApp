import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSearchUsers'
})
export class FilterSearchUsersPipe implements PipeTransform {

  transform(array: any[], text: string): any [] {
    return array;
  }

}
