import {computed, effect, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams, HttpStatusCode} from "@angular/common/http";
import {User} from "../model/user.model";
import {State} from "../model/state.model";
import {environment} from "../../environments/environment";
import {Observable, of, switchMap} from "rxjs";
import {AuthService as Auth0Service} from "@auth0/auth0-angular";
import {toSignal} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private auth0 = inject(Auth0Service);

  notConnected = "NOT_CONNECTED";

  private isAuthenticatedSignal = toSignal(this.auth0.isAuthenticated$, {initialValue: false});

  private fetchUser$: WritableSignal<State<User>> =
    signal(State.Builder<User>().forSuccess({email: this.notConnected}));
  fetchUser = computed(() => this.fetchUser$());

  constructor() {
    // Auto-fetch the connected user once Auth0 reports authenticated state.
    effect(() => {
      if (this.isAuthenticatedSignal()) {
        this.fetch(false);
      } else {
        this.fetchUser$.set(State.Builder<User>().forSuccess({email: this.notConnected}));
      }
    }, {allowSignalWrites: true});
  }

  fetch(forceReSync: boolean): void {
    this.fetchHttpUser(forceReSync)
      .subscribe({
        next: user => this.fetchUser$.set(State.Builder<User>().forSuccess(user)),
        error: err => {
          if (err.status === HttpStatusCode.Unauthorized) {
            this.fetchUser$.set(State.Builder<User>().forSuccess({email: this.notConnected}));
          } else {
            this.fetchUser$.set(State.Builder<User>().forError(err));
          }
        }
      });
  }

  login(): void {
    this.auth0.loginWithRedirect();
  }

  logout(): void {
    this.fetchUser$.set(State.Builder<User>().forSuccess({email: this.notConnected}));
    this.auth0.logout({logoutParams: {returnTo: window.location.origin}});
  }

  isAuthenticated(): boolean {
    if (this.fetchUser$().value) {
      return this.fetchUser$().value!.email !== this.notConnected;
    }
    return false;
  }

  fetchHttpUser(forceResync: boolean): Observable<User> {
    return this.auth0.isAuthenticated$.pipe(
      switchMap(authenticated => {
        if (!authenticated) {
          return of({email: this.notConnected} as User);
        }
        const params = new HttpParams().set('forceResync', forceResync);
        return this.http.get<User>(`${environment.API_URL}/auth/get-authenticated-user`, {params});
      })
    );
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (this.fetchUser$().value!.email === this.notConnected) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.fetchUser$().value!.authorities!
      .some((authority: string) => authorities.includes(authority));
  }
}
