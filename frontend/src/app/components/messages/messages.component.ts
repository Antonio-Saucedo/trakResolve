import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BugService } from 'src/app/services/bug.service';
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

  constructor(private bugService: BugService, activatedRoute: ActivatedRoute) {
    let MessagesObservable: Observable<Message[]>;
    activatedRoute.params.subscribe(() => {
      MessagesObservable = this.bugService.getMessages();
      MessagesObservable.subscribe((userMessages) => {
        this.messages = userMessages;
      });
    });
  }
}
