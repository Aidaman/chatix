import { Pipe, PipeTransform } from "@angular/core";
import { ChatService } from "../services/chat.service";

@Pipe({
  name: "isCreatedByMe"
})
export class IsCreatedByMePipe implements PipeTransform {
  constructor(private chatService: ChatService) {}

  transform(id: string | undefined): boolean {
    return id? id === this.chatService.me : false;
  }
}
