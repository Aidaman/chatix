import { Pipe, PipeTransform } from "@angular/core";
import { IRoom } from "../models/IRoom";

@Pipe({
  name: "updateRooms"
})
export class UpdateRoomsPipe implements PipeTransform {
  transform(rooms: IRoom[] | null): IRoom[] {
    if (rooms === null) return [];
    rooms = rooms.slice().sort((prevRoom, nextRoom) => {
      return +new Date(prevRoom.lastAction) - +new Date(nextRoom.lastAction);
    });
    return rooms;
  }
}
