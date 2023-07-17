import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BugService } from 'src/app/services/bug.service';
import { UserService } from 'src/app/services/user.service';
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
  role: string = this.getRole();

  constructor(
    private bugService: BugService,
    private userService: UserService,
    activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let BugsObservable: Observable<Bug[]>;
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.searchType = params.searchType;
        this.searchTerm = params.searchTerm;
        BugsObservable = this.bugService.getAllBugsBySearchTerms(
          params.searchType,
          params.searchTerm
        );
      } else {
        BugsObservable = bugService.getAll();
      }
      BugsObservable.subscribe((serverBugs) => {
        this.bugs = serverBugs;
      });
    });
  }

  getRole() {
    return this.userService.currentUserRole;
  }

  search(type: string, term: string): void {
    if (term) {
      this.searchType = type;
      this.searchTerm = term;
      this.router.navigateByUrl('/search/' + type + '/' + term);
    }
  }
}
