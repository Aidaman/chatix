import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  transform(value: string, start: number, length: number): unknown {
    return value.slice(0, 20);
  }

}
