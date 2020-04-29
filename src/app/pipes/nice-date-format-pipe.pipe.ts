import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'niceDateFormatPipe',
  pure: false
})
export class NiceDateFormatPipePipe implements PipeTransform {
  transform(value: string) {

    let _value = Number(value);
    let date = isNaN(_value) ? new Date(value).getTime(): _value;
    let timeDiff = (((new Date()).getTime() - date) / 1000);
    let daydiff = Math.floor(timeDiff / 86400);

    if (daydiff < 30) {
      return convertToNiceDate(daydiff, timeDiff);
    } else {
      const datePipe = new DatePipe('en-US');
      value = datePipe.transform(value, 'MMM-dd-yyyy');
      return value;
    }
  }
}

function convertToNiceDate(daydiff: number, timeDiff: number) {

  if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
    return '';

  return daydiff === 0 && (
    timeDiff < 60 && 'Just now' ||
    timeDiff < 120 && '1 minute ' ||
    timeDiff < 3600 && Math.floor(timeDiff / 60) + ' minutes ' ||
    timeDiff < 7200 && '1 hour ago' ||
    timeDiff < 86400 && Math.floor(timeDiff / 3600) + ' hours ') ||
    daydiff === 1 && 'Yesterday' ||
    daydiff < 7 && daydiff + ' days ago' ||
    daydiff < 31 && Math.ceil(daydiff / 7) + ' week(s) ';
}

