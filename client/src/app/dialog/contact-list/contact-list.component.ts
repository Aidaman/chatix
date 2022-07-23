import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";
import {AuthService} from "../../shared/services/auth.service";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {IUser} from "../../shared/models/IUser";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  @Input() isDisplayed: boolean = false;
  @Output() closeParticipants: EventEmitter<any> = new EventEmitter<any>();

  private me: string = this.localStorageService.getUser()['id'] as string;
  private blacklist: string[] = [];
  private lastSelectedContactId: string = '';
  private content: string = '';
  public list: IUser[] = [];
  public roomId: string = '';
  public theme: string = 'dark';
  // public menuItems: MenuItemModel[] = [
  //     {
  //         id: 'invite',
  //         text: 'Invite to the chat',
  //         iconCss: 'e-cm-icons e-add'
  //     },
  //     {
  //         separator: true
  //     },
  //     {
  //         id: 'ban',
  //         text: 'Add to blacklist',
  //         iconCss: 'e-cm-icons e-ban'
  //     }];

  constructor(private socketService: SocketService,
              private chatService: ChatService,
              private localStorageService: LocalStorageService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      // this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
      this.blacklist = this.localStorageService.getBlacklist();
      this.chatService.currentRoomUsers.subscribe(users => {
        this.list = (users as IUser[]);
      });
    }
  }
}
