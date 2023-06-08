import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from 'src/app/shared/bug';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
  constructor(private bugService: BugService, activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.bugs = this.bugService.getAllBugsBySearchTerms(
          params.searchType,
          params.searchTerm
        );
      } else {
        this.bugs = bugService.getAll();
      }
    });
  }
}
