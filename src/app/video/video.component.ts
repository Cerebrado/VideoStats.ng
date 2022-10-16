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
    this.videoPlayer = el.nativeElement;
  }
  timeToJump=5;
  isPlaying: boolean = false

  canvas: HTMLCanvasElement
  

  @ViewChild('canvas')
  set mainCanvasEl(el: ElementRef) {
    this.canvas = el.nativeElement;
  }
  bitmapPos = {x:0, y:0}
  canvasControlPos = {x:0, y:0}
  
  ctx: CanvasRenderingContext2D;

  constructor() {
    window.onresize = (e) => this.resizeVideo();
  }

  observer: MutationObserver

  ngAfterViewInit(): void {
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style.left = this.videoPlayer.clientLeft.toString()
    this.canvas.style.top = this.videoPlayer.clientTop.toString()
    this.canvasControlPos = this.GetScreenCordinates(this.canvas);
    this.videoPlayer.oncanplay = (e) => this.canplay()
  }

  canplay(){
    this.resizeVideo();
  }

  GetScreenCordinates(obj) {
    var p = {x: 0, y: 0};
    p.x = obj.offsetLeft;
    p.y = obj.offsetTop;
    while (obj.offsetParent) {
        p.x = p.x + obj.offsetParent.offsetLeft;
        p.y = p.y + obj.offsetParent.offsetTop;
        if (obj == document.getElementsByTagName("body")[0]) {
            break;
        }
        else {
            obj = obj.offsetParent;
        }
    }
    return p;
}
  load(){

  }

  pause(){
    this.isPlaying = false
  }

  play(){
    this.isPlaying = true
  }

  playPause() {
    if (this.videoPlayer.paused) {
      this.videoPlayer.play();
      this.play();
    } else {
      this.videoPlayer.pause();
      this.pause();
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
    this.timeChanged.emit(data.target.currentTime);
  }

  resizeVideo() {

    const imgD =this.ctx.getImageData(0, 0, this.canvas.width - 1, this.canvas.height - 1); 

    this.canvas.width = this.videoPlayer.clientWidth
    this.canvas.height = this.videoPlayer.clientHeight

    this.ctx.putImageData(imgD, 0, 0);
    //console.log(`V:${this.videoPlayer.clientLeft} C:${this.canvas.clientLeft}`)
  }

  setPosition(e) {
    this.bitmapPos.x = e.clientX - this.canvasControlPos.x
    this.bitmapPos.y = e.clientY - this.canvasControlPos.y; 
  }
  
  mouseIsInCanvas: boolean = false
  mouseEnter(){
    this.mouseIsInCanvas = true;
  }
  mouseLeave(){
    this.mouseIsInCanvas = false;
  }

  
  clearCanvas(){
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    this.previousPointSet = false;
  }

  drawingMode = 1
  setDrawingMode(mode: number){
    this.drawingMode = mode;
  }

  mouseMove(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1 || this.drawingMode != 1) return;
    this.drawLine(e);
  }

  previousPointSet = false
  mouseDown(e){
    if(this.drawingMode > 1) {
      if(!this.previousPointSet) {
        this.previousPointSet = true;
      }
      else
      {
        this.drawLine(e)
        if(this.drawingMode === 3){
          this.previousPointSet = false;
          return;
        }
      }
    }
    this.setPosition(e);
  }

  drawLine(e) {
    this.ctx.beginPath(); // begin

    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#c0392b';
  
    this.ctx.moveTo(this.bitmapPos.x, this.bitmapPos.y); // from
    this.setPosition(e);
    this.ctx.lineTo(this.bitmapPos.x, this.bitmapPos.y); // to
  
    this.ctx.stroke(); // draw it!
  }

}
