import { Injectable } from '@angular/core';
import { Bug } from '../shared/models/bug';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BUGS_BY_SEARCH_URL, BUGS_ID_URL, BUGS_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getAll(): Observable<Bug[]> {
    return this.http.get<Bug[]>(BUGS_URL);
  }

  getById(id: string): Observable<Bug> {
    return this.http.get<Bug>(BUGS_ID_URL + id);
  }

  getAllBugsBySearchTerms(
    searchType: string,
    searchTerm: string
  ): Observable<Bug[]> {
    return this.http.get<Bug[]>(
      BUGS_BY_SEARCH_URL + searchType + '/' + searchTerm
    );
  }

  reportBug(bugReport: Bug) {
    return this.http.post<Bug>(BUGS_URL, bugReport).pipe(
      tap({
        next: (bug:any) => {
          console.log(bug.insertedId);
          this.toastrService.success(`Bug report ID: ${bug.insertedId}.`,'Bug report created successfully.', {
          positionClass: 'toast-success'});
        },
        error: (errorResponse) => {
          this.toastrService.error(
            errorResponse.statusText,
            'An error occurred.', {positionClass: 'toast-error'}
          );
        },
      })
    );
  }
}
