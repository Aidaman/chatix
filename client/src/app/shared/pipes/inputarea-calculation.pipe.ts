import { Pipe, PipeTransform } from "@angular/core";

/*
*  @description This is the pipe for change the height of the input-field in the room
*/
@Pipe({
  name: "calculateRowsPipe"
})
export class InputareaCalculationPipe implements PipeTransform {

  transform(value: string): number {
    if (value.trim().length < 64) return 1;
    const numberOfRows = value.trim().length / 64;

    if (numberOfRows <= 8) return numberOfRows;
    else return 8;
  }

}
