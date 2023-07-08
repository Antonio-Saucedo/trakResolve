import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ReportBugComponent } from './components/report-bug/report-bug.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateInfoComponent } from './components/update-info/update-info.component';
import { MessagesComponent } from './components/messages/messages.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BugResolveComponent } from './components/bug-resolve/bug-resolve.component';
import { BugComponent } from './components/bug/bug.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    SearchComponent,
    ReportBugComponent,
    NotFoundComponent,
    LoginPageComponent,
    ProfileComponent,
    UpdateInfoComponent,
    MessagesComponent,
    RegisterPageComponent,
    LoadingComponent,
    BugResolveComponent,
    BugComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      // timeOut: 3000,
      disableTimeOut: true,
      easing: "500",
      newestOnTop: false,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
