import { Injectable } from '@angular/core';
import { Bug } from '../shared/bug';
import { sample_bugs } from 'src/data';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  constructor() {}

  getAll(): Bug[] {
    return sample_bugs;
  }

  getAllBugsBySearchTerms(searchType: string, searchTerm: string) {
    const valid = ['_id', 'summary', 'link', 'description'];
    if (searchType in valid) {
      console.log('filtered');
      return this.getAll().filter((bug) =>
        bug.searchType.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    } else {
      console.log('Notfiltered');
      return this.getAll();
    }
  }
}
