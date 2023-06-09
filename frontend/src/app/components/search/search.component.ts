import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BugService } from 'src/app/services/bug.service';
import { Bug } from 'src/app/shared/models/bug';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchType = '_id';
  searchTerm = '';

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  bugs: Bug[] = [];

  constructor(
    private bugService: BugService,
    activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchType) {
        this.searchType = params.searchType;
      }
      if (params.searchTerm) {
        this.searchTerm = params.searchTerm;
        this.bugs = this.bugService.getAllBugsBySearchTerms(
          params.searchType,
          params.searchTerm
        );
      } else {
        this.bugs = bugService.getAll();
      }
    });
  }

  search(type: string, term: string): void {
    if (term) {
      this.searchType = type;
      this.searchTerm = term;
      this.router.navigateByUrl('/search/' + type + '/' + term);
    }
  }
}
