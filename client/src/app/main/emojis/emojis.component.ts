import { Component } from "@angular/core";
import { EMOJI } from "../../shared/EMOJIS";
import { ThemingService } from "../../shared/services/theming.service";
import { RoomService } from "../../shared/services/room.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: "app-emojis",
  templateUrl: "./emojis.component.html",
  styleUrls: ["./emojis.component.scss"]
})
export class EmojisComponent {
  public smiles: string[] = Object.values(EMOJI);
  // public showEmoji: BehaviorSubject<boolean> = this.roomService.showEmoji;

  constructor(public roomService: RoomService) {
  }

  public sendToInput(smile: string): void {
    this.roomService.emoji.next(smile);
  }

}
