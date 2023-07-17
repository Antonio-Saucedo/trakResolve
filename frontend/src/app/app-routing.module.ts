import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';
import { ReportBugComponent } from './components/report-bug/report-bug.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateInfoComponent } from './components/update-info/update-info.component';
import { MessagesComponent } from './components/messages/messages.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { BugResolveComponent } from './components/bug-resolve/bug-resolve.component';
import { BugComponent } from './components/bug/bug.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  {
    path: 'search/:searchType/:searchTerm',
    component: SearchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reportBug',
    component: ReportBugComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bugResolve',
    component: BugResolveComponent,
    canActivate: [AuthGuard],
  },
  { path: 'bug/:id', component: BugComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'updateInfo',
    component: UpdateInfoComponent,
    canActivate: [AuthGuard],
  },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
