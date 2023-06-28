import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { HomeComponent } from './components/home/home.component';
import { ReportBugComponent } from './components/report-bug/report-bug.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateInfoComponent } from './components/update-info/update-info.component';
import { MessagesComponent } from './components/messages/messages.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search/:searchType/:searchTerm', component: SearchComponent },
  { path: 'reportBug', component: ReportBugComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'updateInfo', component: UpdateInfoComponent },
  { path: 'messages', component: MessagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
