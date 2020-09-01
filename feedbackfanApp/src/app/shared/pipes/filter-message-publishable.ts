import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMessagePublishable'
})
export class FilterMessagePublishablePipe implements PipeTransform {

  transform(message: any): boolean {
    if (message.isPublishableReceiver === message.isPublishableSender &&
        message.isPublishableSender &&
        message.isPublishableReceiver) {
      return true ;
    } else {
      return false;
    }
  }

}
