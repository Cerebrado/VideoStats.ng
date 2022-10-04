import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
})
export class VideoComponent {
  constructor() {}

  videoPlayer: HTMLVideoElement;
  @ViewChild('videoPlayer')
  set mainVideoEl(el: ElementRef) {
    this.videoPlayer = el.nativeElement;
  }

  playPause() {
    if (this.videoPlayer.paused) {
      this.videoPlayer.play();
    } else {
      this.videoPlayer.pause();
    }
  }

  timeToJump=5;
  rewind() {
    this.videoPlayer.currentTime -= this.timeToJump;
  }
  forward() {
    this.videoPlayer.currentTime += this.timeToJump;
  }

  @Output() timeChanged = new EventEmitter<any>();
  timeUpdate(data) {
    //console.log(data.target.currentTime);
    this.timeChanged.emit(data.target.currentTime);
  }

  setSize(size: number){
    
  }
}
