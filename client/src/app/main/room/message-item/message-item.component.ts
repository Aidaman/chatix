import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMessage} from "../../../shared/models/IMessage";
import {ChatService} from "../../../shared/services/chat.service";
import {ThemingService} from "../../../shared/services/theming.service";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-message-item',
    templateUrl: './message-item.component.html',
    styleUrls: ['./message-item.component.scss']
})
// export class MessageItemComponent implements OnInit {
export class MessageItemComponent implements OnInit {
    @Input() message!: IMessage;
    @Output() loadRequest: EventEmitter<any> = new EventEmitter<any>();
    @Output() viewChange: EventEmitter<{inView: boolean, id: string}> = new EventEmitter<{inView: boolean, id: string,}>();
    public theme: BehaviorSubject<string> = this.themeService.theme;
    public me = this.chatService.me;

    constructor(private chatService: ChatService,
                private themeService: ThemingService,) {
    }

    ngOnInit(): void {
    }

    public messageRequest(scroll?: boolean): void {
        this.loadRequest.emit(scroll);
    }

    public viewportChange(e: any): void {
        if (this.message.read.indexOf(this.chatService.me) === -1 && this.me !== this.message.creator?.id) {
            this.viewChange.emit({inView: e, id: this.message._id,});
        }
    }
}
