import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Message } from 'src/app/shared/models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  messages: Message[] = [];

  constructor(
    private userService: UserService,
    activatedRoute: ActivatedRoute
  ) {
    let MessagesObservable: Observable<Message[]>;
    activatedRoute.params.subscribe(() => {
      MessagesObservable = this.userService.getMessages();
      MessagesObservable.subscribe((userMessages) => {
        this.messages = userMessages;
        for (let i = 0; i < this.messages.length; i++) {
        console.log(this.messages[i]);
        }
      });
    });
  }
}
