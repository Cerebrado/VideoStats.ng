import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewMatchComponent } from './new-match/new-match.component';
import { PasswordSetComponent } from './passwordSet/passwordSet.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'pwdSet',
    component: PasswordSetComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: NewMatchComponent,
    //canActivate: [AuthGuard]
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
