import { Injectable } from '@angular/core';
import { Bug } from '../shared/models/bug';
import { sample_bugs } from 'src/data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BUGS_BY_SEARCH_URL, BUGS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Bug[]> {
    return this.http.get<Bug[]>(BUGS_URL);
  }

  getAllBugsBySearchTerms(searchType: string, searchTerm: string) {
    return this.http.get<Bug[]>(
      BUGS_BY_SEARCH_URL + searchType + '/' + searchTerm
    );
  }
}
