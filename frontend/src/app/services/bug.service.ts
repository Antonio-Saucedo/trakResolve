import { Injectable } from '@angular/core';
import { Bug } from '../shared/models/bug';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  BUGS_BY_SEARCH_URL,
  BUGS_ID_URL,
  BUGS_URL,
  BUG_TAGS_ID_URL,
  BUG_MESSAGE_URL,
} from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../shared/models/message';

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
        next: (bug: any) => {
          console.log(bug.insertedId);
          this.toastrService.success(
            `Bug report ID: ${bug.insertedId}.`,
            'Bug report created successfully.',
            {
              positionClass: 'toast-success',
            }
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(
            errorResponse.statusText,
            'An error occurred.',
            { positionClass: 'toast-error' }
          );
        },
      })
    );
  }

  updateBug(id: string, bugReport: Bug) {
    return this.http.put<Bug>(BUGS_ID_URL + id, bugReport).pipe(
      tap({
        next: (bug: any) => {
          this.toastrService.success(
            'Bug report updated successfully.',
            `Bug report ID: ${id}.`,
            {
              positionClass: 'toast-success',
            }
          );
        },
        error: (errorResponse) => {
          if (errorResponse.statusText == 'Not Modified') {
            this.toastrService.error(
              'Make changes to bug report to update.',
              errorResponse.statusText,
              { positionClass: 'toast-error' }
            );
          } else {
            this.toastrService.error(
              errorResponse.statusText,
              'An error occurred.',
              { positionClass: 'toast-error' }
            );
          }
        },
      })
    );
  }

  addTags(id: string, body: string) {
    return this.http.put<string>(BUG_TAGS_ID_URL + id, body).pipe(
      tap({
        next: () => {
          this.toastrService.success(
            'Tag: updated successfully.',
            `Tags ${id}.`,
            {
              positionClass: 'toast-success',
            }
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(
            errorResponse.statusText,
            'An error occurred.',
            { positionClass: 'toast-error' }
          );
        },
      })
    );
  }

  getMessages(): Observable<Message[]> {
    const user =
      JSON.parse(localStorage.getItem('User')!).firstName +
      '_' +
      JSON.parse(localStorage.getItem('User')!).lastName;
    return this.http.get<Message[]>(BUG_MESSAGE_URL + user);
  }
}
