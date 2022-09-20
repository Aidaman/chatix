import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SignalRService {
  private messagesHubConnection!: HubConnection;
  private roomsHubConnection!: HubConnection;
  private usersHubConnection!: HubConnection;
  public data: any;

  constructor(private http: HttpClient) {  }

  public listenMessageEvent(eventName: string, handler: (...args: any) => void){
    this.messagesHubConnection?.on(eventName, handler);
  }

  public listenRoomEvent(eventName: string, handler: (...args: any) => void){
    this.roomsHubConnection?.on(eventName, handler);
  }

  public listenUserEvent(eventName: string, handler: (...args: any) => void){
    this.usersHubConnection?.on(eventName, handler);
  }

  public startMessagesConnection(){
    this.messagesHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/message")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.messagesHubConnection
      .start().then(() => console.log("Message Connection Started"))
      .catch((error) => {
        console.log(`there is an error in messages connection: ${error}`);
      });

    this.messagesHubConnection.onreconnected(() => {
      this.http.get("https://localhost:5001/api/message/")
        .subscribe(res => {
          console.log(res);
        });
    });
  }

  public startRoomsConnection(){
    this.roomsHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/room")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.roomsHubConnection
      .start().then(() => console.log("Room Connection Started"))
      .catch((error) => {
        console.log(`there is an error in rooms connection: ${error}`);
      });

    this.roomsHubConnection.onreconnected(() => {
      this.http.get("https://localhost:5001/api/rooms/")
        .subscribe(res => {
          console.log(res);
        });
    });
  }

  public startUsersConnection(){
    this.usersHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/user")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.usersHubConnection
      .start().then(() => console.log("User Connection Started"))
      .catch((error) => {
        console.log(`there is an error in users connection: ${error}`);
      });

    this.usersHubConnection.onreconnected(() => {
      this.http.get("https://localhost:5001/api/users/")
        .subscribe(res => {
          console.log(res);
        });
    });
  }

  public invokeMessageEvent(eventName: string, ...args: any){
    this.messagesHubConnection?.invoke(eventName, args).catch((error) => {
      console.log(`there is an error in ${eventName}: ${error}`);
    });
  }

  public invokeRoomEvent(eventName: string, ...args: any){
    this.roomsHubConnection?.invoke(eventName, args).catch((error) => {
      console.log(`there is an error in ${eventName}: ${error}`);
    });
  }

  public invokeUserEvent(eventName: string, ...args: any){
    this.usersHubConnection?.invoke(eventName, args).catch((error) => {
      console.log(`there is an error in ${eventName}: ${error}`);
    });
  }
}
