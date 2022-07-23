import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateRowsPipe'
})
export class InputAreacalculationPipe implements PipeTransform {

  transform(value: string): number {
    if (value.trim().length < 64) return 1;
    const numberOfRows = value.trim().length / 64;

    if (numberOfRows <= 8) return numberOfRows;
    else return 8;
  }

}
