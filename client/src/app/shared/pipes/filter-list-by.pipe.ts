import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterListBy"
})
export class FilterListByPipe implements PipeTransform {

  transform(value: Array<any>, sortBy: string, condition: string): Array<any> {
    return value.filter((el) => String(el[sortBy]) === condition);
  }

}
