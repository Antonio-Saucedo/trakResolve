import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from 'src/app/shared/models/bug';

@Component({
  selector: 'app-bug-resolve',
  templateUrl: './bug-resolve.component.html',
  styleUrls: ['./bug-resolve.component.scss'],
})
export class BugResolveComponent {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  bugs: Bug[] = [];

  constructor(private bugService: BugService) {
    let BugsObservable: Observable<Bug[]>;
    BugsObservable = bugService.getAll();
    BugsObservable.subscribe((serverBugs) => {
      this.bugs = serverBugs;
    });
  }
}
