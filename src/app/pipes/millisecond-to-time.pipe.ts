import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondToTime',
  standalone: true,
  pure: true
})
export class MillisecondToTimePipe implements PipeTransform {

  transform(millis: number): unknown {
    var minutes = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

}
