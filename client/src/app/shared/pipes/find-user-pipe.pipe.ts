import { Pipe, PipeTransform } from '@angular/core';
import {IUser} from "../models/IUser";

@Pipe({
  name: 'findUserPipe'
})
export class FindUserPipe implements PipeTransform {

  transform(creator: string, value: IUser[]): string {
    return value.find((user)=> user._id !== creator)?.name as string;
  }

}
