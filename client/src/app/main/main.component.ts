import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "../shared/services/chat.service";
import { AuthService } from "../shared/services/auth.service";
import { SocketService } from "../shared/services/socket.service";
import { LocalStorageService } from "../shared/services/local-storage.service";
import { Subscription } from "rxjs";
import { ThemingService } from "../shared/services/theming.service";
import { Router } from "@angular/router";

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
  private blackListSub: Subscription = this.chatService.getBlacklist().subscribe(blacklist => {
    this.localStorageService.setBlacklist(blacklist);
  });

  constructor(private chatService: ChatService,
              private themingService: ThemingService,
              private localStorageService: LocalStorageService,
              private router: Router,
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
    this.blackListSub.unsubscribe();
    this.socketService.destroy();
  }
}
