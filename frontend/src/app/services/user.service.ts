import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/user';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import {
  USER_DEVTEAM,
  USER_LOGIN_URL,
  USER_REGISTER_URL,
} from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { Names } from '../shared/interfaces/names';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );

  public userObservable: Observable<User>;

  public currentUserId = this.getUserId();

  public currentUserName = this.getUserName();

  public currentUserRole = this.getRole();

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  private getUserId(): string {
    return this.userSubject.value.id;
  }

  private getUserName(): string {
    return (
      this.userSubject.value.firstName + '_' + this.userSubject.value.lastName
    );
  }

  private getRole(): string {
    return this.userSubject.value.role;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Trak Resolve ${user.firstName}!`,
            'Login Successful.',
            {
              positionClass: 'toast-success',
            }
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed.', {
            positionClass: 'toast-error',
          });
        },
      })
    );
  }

  register(userRegiser: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the Trak Resolve ${user.firstName}`,
            'Register Successful.'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed.');
        },
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem('User');
    window.location.reload();
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem('User', JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem('User');
    if (userJson) {
      return JSON.parse(userJson) as User;
    } else {
      return new User();
    }
  }

  getDevTeam(): Observable<Names[]> {
    return this.http.get<Names[]>(USER_DEVTEAM);
  }
}
