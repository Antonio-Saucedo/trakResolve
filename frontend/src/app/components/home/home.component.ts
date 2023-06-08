import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from 'src/app/shared/models/bug';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  bugs: Bug[] = [];
  constructor(bugService: BugService) {
    this.bugs = bugService.getAll();
  }
}
