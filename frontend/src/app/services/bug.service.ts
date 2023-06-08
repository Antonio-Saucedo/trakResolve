import { Injectable } from '@angular/core';
import { Bug } from '../shared/models/bug';
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
    if (searchType == '_id') {
      return this.getAll().filter(
        (bug) => bug._id == Number(searchTerm)
      );
    } else if (searchType == 'summary') {
      return this.getAll().filter((bug) =>
        bug.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType == 'link') {
      return this.getAll().filter((bug) =>
        bug.link.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType == 'description') {
      return this.getAll().filter((bug) =>
        bug.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchType == 'resolved') {
      return this.getAll().filter((bug) =>
        bug.resolved == (searchTerm.toLowerCase() =="true")
      );
    } else {
      return this.getAll();
    }
  }
}
