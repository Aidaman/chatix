import { Pipe, PipeTransform } from '@angular/core';
import {IRoom} from "../models/IRoom";
import {IUser} from "../models/IUser";

@Pipe({
  name: 'isPersonalMessagePipe'
})
export class IsPersonalMessagePipePipe implements PipeTransform {

  transform(currentUser: string, room: IRoom): string {
    if (room.users.length > 2) return room.title;

    const findResult: IUser | undefined = room.users.find((user)=> user._id !== currentUser);
    return findResult === undefined? room.title : findResult.name;
  }

}
