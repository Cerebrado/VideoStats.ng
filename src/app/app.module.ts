import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VideoComponent } from './video/video.component';
import { CourtComponent } from './court/court.component';
import { PlayersComponent } from './players/players.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PasswordSetComponent } from './passwordSet/passwordSet.component';
  
@NgModule({
  imports: [BrowserModule, FormsModule, NgbModule, AppRoutingModule],
  declarations: [				
    AppComponent,
    VideoComponent,
    CourtComponent,
    PlayersComponent,
    LoginComponent,
    HomeComponent,
    PasswordSetComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
