import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumberSuffix'
})
export class ShortNumberSuffixPipe implements PipeTransform {

  // tslint:disable-next-line: variable-name
  transform(number: number, args?: any): any {
    if (isNaN(number)) { return null; } // will only work value is a number
    if (number === null) { return null; }
    if (number === 0) { return null; }
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 1);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
        {key: 'Q', value: Math.pow(10, 15)},
        {key: 'T', value: Math.pow(10, 12)},
        {key: 'B', value: Math.pow(10, 9)},
        {key: 'M', value: Math.pow(10, 6)},
        {key: 'm', value: 1000}
    ];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < powers.length; i++) {
        let reduced = abs / powers[i].value;
        reduced = Math.round(reduced * rounder) / rounder;
        if (reduced >= 1) {
            abs = reduced;
            key = powers[i].key;
            break;
        }
    }
    return (isNegative ? '-' : '') + abs + key;
  }
}
