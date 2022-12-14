import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { VideoComponent } from './video/video.component';

import { CourtComponent } from './court/court.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PasswordSetComponent } from './passwordSet/passwordSet.component';


import { NewEventComponent } from './new-event/new-event.component';
import { InputBoxComponent } from './input-box/input-box.component';
import { NewMatchComponent } from './new-match/new-match.component';
import { EventsPanelComponent } from './events-panel/events-panel.component';
import { NewSportComponent } from './new-sport/new-sport.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { EditScoreComponent } from './edit-score/edit-score.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { YtVideoComponent } from './yt-video/yt-video.component';
  
@NgModule({
  imports: [
    BrowserModule, 
    FormsModule, 
    NgbModule, 
    AppRoutingModule,
    YouTubePlayerModule
  ],
  declarations: [											
    AppComponent,
    VideoComponent,
    CourtComponent,
    LoginComponent,
    HomeComponent,
    PasswordSetComponent,
    InputBoxComponent,
    NewEventComponent,
    SettingsComponent,
    NewMatchComponent,
      EventsPanelComponent,
      NewSportComponent,
      ScoreboardComponent,
      EditScoreComponent,
      YtVideoComponent
   ],
  bootstrap: [AppComponent],
})
export class AppModule {}
