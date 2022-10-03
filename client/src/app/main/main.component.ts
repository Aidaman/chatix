import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { SocketService } from "../shared/services/socket.service";
import { LocalStorageService } from "../shared/services/local-storage.service";
import { from, mergeAll, tap } from "rxjs";
import { ThemingService } from "../shared/services/theming.service";
import { Router } from "@angular/router";
import { ModalsService } from "../shared/services/modals.service";
import { Store } from "@ngrx/store";
import { chatGetAvailableRooms } from "../store/chat/chat.actions";

/*
* @description This component just wraps another subcomponents
* @description also it forms the module for being able to navigate
*/
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnDestroy, OnInit {
  // private blackListSub: Subscription = this.chatService.getBlacklist().subscribe(blacklist => {
  //   this.localStorageService.setBlacklist(blacklist);
  // });

  constructor(private localStorageService: LocalStorageService,
              private modalsService: ModalsService,
              private router: Router,
              private themingService: ThemingService,
              private store: Store,
              private authService: AuthService,
              private socketService: SocketService) {
  }

  public ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.socketService.connect();
    }
    if (this.localStorageService.getUser()["colorTheme"]) {
      this.themingService.theme.next(this.localStorageService.getUser()["colorTheme"] as string);
    }
  }

  ngOnDestroy(): void {
    // this.blackListSub.unsubscribe();
    this.socketService.destroy();
  }
}
