import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Suppress expected Auth0 SDK rejections that surface when the SDK can't
// silently obtain a token (no refresh token / no SSO session). These aren't
// real errors — the AuthService already handles the "not authenticated" path.
const AUTH0_EXPECTED_ERRORS = new Set([
  'missing_refresh_token',
  'login_required',
  'consent_required',
]);
window.addEventListener('unhandledrejection', (event) => {
  const reason: any = event.reason;
  if (reason && AUTH0_EXPECTED_ERRORS.has(reason.error)) {
    event.preventDefault();
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
