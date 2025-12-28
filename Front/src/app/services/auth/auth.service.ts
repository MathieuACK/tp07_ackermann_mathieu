import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { UsersService } from '../users/users.service';
import { User } from '../../models/users';
import { SetCurrentUser } from '../../shared/actions/favorites.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  constructor(private usersService: UsersService, private store: Store) {
    // Initialize store with current user if logged in
    const currentUser = this.currentUser$.value;
    if (currentUser) {
      this.store.dispatch(new SetCurrentUser(currentUser.id));
    }
  }

  public login(login: string, password: string): Observable<boolean> {
    return this.usersService.getUsers().pipe(
      map((users) => {
        const found = users.find(
          (u) => u.login === login && u.password === password
        );
        if (found) {
          this.currentUser$.next(found);
          localStorage.setItem('currentUser', JSON.stringify(found));
          this.store.dispatch(new SetCurrentUser(found.id));
          return true;
        }
        return false;
      })
    );
  }

  public signup(user: Partial<User>): Observable<boolean> {
    return this.usersService.addUser(user).pipe(
      map((created) => {
        if (created) {
          this.currentUser$.next(created as User);
          localStorage.setItem('currentUser', JSON.stringify(created));
          this.store.dispatch(new SetCurrentUser((created as User).id));
          return true;
        }
        return false;
      }),
      catchError((err) => {
        // return false on error (e.g., 409 conflict)
        return of(false);
      })
    );
  }

  public logout(): void {
    this.currentUser$.next(null);
    localStorage.removeItem('currentUser');
    this.store.dispatch(new SetCurrentUser(null));
  }

  public getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  public isLoggedIn(): boolean {
    return this.currentUser$.value !== null;
  }
}
