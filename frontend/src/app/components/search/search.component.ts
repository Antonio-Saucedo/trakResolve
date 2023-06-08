import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchType = '';
  searchTerm = '';
  constructor(activatedRoute:ActivatedRoute, private router:Router){
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) {
        this.searchType = params.searchType;
        this.searchTerm = params.searchTerm
      }
    });
  }
}
