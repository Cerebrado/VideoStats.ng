import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import {
  AfterViewInit,
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
export class VideoComponent implements AfterViewInit{

  videoPlayer: HTMLVideoElement;
  @ViewChild('videoPlayer')
  set mainVideoEl(el: ElementRef) {
    console.log('video viewchild')
    this.videoPlayer = el.nativeElement;
  }
  timeToJump=5;
  isPlaying: boolean = false

  canvas: HTMLCanvasElement

  @ViewChild('canvas')
  set mainCanvasEl(el: ElementRef) {
    console.log('canvas viewchild')
    this.canvas = el.nativeElement;
  }
  canvasPos = {x:0, y:0}
  ctx: CanvasRenderingContext2D;
  mouseIsInCanvas: boolean = false

  constructor() {
  }

  observer: MutationObserver

  ngAfterViewInit(): void {
    this.ctx = this.canvas.getContext('2d')
    this.resizeVideo();
  }

  load(){

  }
  pause(){
    this.isPlaying = false;
  }

  play(){
    this.isPlaying = true;
  }

  playPause() {
    if (this.videoPlayer.paused) {
      this.videoPlayer.play();
      this.isPlaying = true;
    } else {
      this.videoPlayer.pause();
      this.isPlaying = false;
    }
  }

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

  resizeVideo() {

    //this.canvas.setAttribute('width', this.videoPlayer.getAttribute('width'))
    //this.canvas.setAttribute('height', this.videoPlayer.getAttribute('heigt'))

    //  this.canvas.width = this.videoPlayer.width;
    //  this.canvas.height = this.videoPlayer.height;

     //const imgD =this.ctx.getImageData(0, 0, this.canvas.width - 1, this.canvas.height - 1); 

     //this resizes the canvas, but not the bitmap
    //  this.canvas.style.width = this.videoPlayer.style.width;
    //   this.canvas.style.height = this.videoPlayer.style.height;

      this.canvas.width = this.videoPlayer.clientWidth-10;
      this.canvas.height = this.videoPlayer.clientHeight-10;

      //this.ctx.putImageData(imgD, 0, 0);
      console.log(`W:${this.canvas.width} SW:${this.canvas.style.width} CW:${this.canvas.clientWidth}`)
  }

  setPosition(e) {
    this.mouseIsInCanvas = true;
    this.canvasPos.x = e.clientX - this.canvas.offsetLeft;
    this.canvasPos.y = e.clientY - this.canvas.offsetTop;

    //this.canvasPos.x = e.clientX;
    //this.canvasPos.y = e.clientY;
  }
  
  mouseLeave(){
    this.mouseIsInCanvas = false;
  }

  
  clearCanvas(){
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
  }

  draw(e) {
    // mouse left button must be pressed
    //if ((!this.mouseIsInCanvas) || e.buttons !== 1 ) return;
  
    this.ctx.beginPath(); // begin

    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#c0392b';
  
    this.ctx.moveTo(this.canvasPos.x, this.canvasPos.y); // from
    this.setPosition(e);
    this.ctx.lineTo(this.canvasPos.x, this.canvasPos.y); // to
  
    this.ctx.stroke(); // draw it!
  }

  
}
