import { Pipe, PipeTransform } from "@angular/core";
import { IRoom } from "../models/IRoom";
import { IUser } from "../models/IUser";
import {ChatService} from "../services/chat.service";

@Pipe({
  name: "isPersonalMessagePipe"
})
export class IsPersonalMessagePipePipe implements PipeTransform {

  constructor(private chatService: ChatService) {
  }

  transform(room: IRoom): string {
    if (room.users.length > 2 || room.isPublic) return room.title;

    const findResult: IUser | undefined = room.users.find((user) => user._id !== this.chatService.me);
    return findResult === undefined? room.title : findResult.name;
  }

}
