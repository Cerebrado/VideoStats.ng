import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-yt-video',
  templateUrl: './yt-video.component.html',
})
export class YtVideoComponent implements OnInit {

  constructor() {
    window.onresize = (e) => this.resizeCanvas();
  }

  ngOnInit() {
    //adding yt api here, instead of in index.html
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  onYTReady(){

    //const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    //const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    
  }
  onYTStateChange(event){
      this.isPlaying = event.data === 1 
  }

  @ViewChild('ytPlayer') ytPlayer: YouTubePlayer;

  
  canvas: HTMLCanvasElement
  @ViewChild('canvas')
  set mainCanvasEl(el: ElementRef) {
    this.canvas = el.nativeElement;
  }

  divVideo: HTMLDivElement
  @ViewChild('divVideo')
  set mainDivVideoEl(el: ElementRef) {
    this.divVideo = el.nativeElement;
  }

  timeToJump=5;
  isPlaying: boolean = false
  videoPlayerCurrentTime = 0;
  bitmapPos = {x:0, y:0}
  canvasControlPos = {x:0, y:0}
  
  ctx: CanvasRenderingContext2D;
  @Input()
  videoId:string;

  observer: MutationObserver

  ngAfterViewInit(): void {
    this.ctx = this.canvas.getContext('2d', {willReadFrequently:true})
    //this.ctx.willReadFrequently = true;
    this.canvas.style.left = this.divVideo.clientLeft.toString() 
    this.canvas.style.top = this.divVideo.clientTop.toString()
    this.canvasControlPos = this.GetScreenCordinates(this.canvas);
  }

  canplay(){
    this.resizeCanvas();
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


  playPause() {
    const playerState = this.ytPlayer.getPlayerState();
    if(playerState === YT.PlayerState.PLAYING){
      //remove div with class 'ytp-pause-overlay-container'
      this.ytPlayer.pauseVideo();

      //no puedo borrar elementos dentro del puto iframe de youtube.
      // var iframes  = document.getElementsByTagName('iframe')
      // if(iframes.length === 0)
      //   return;
      
      // var eles = iframes[0].contentWindow.document.getElementsByClassName('ytp-pause-overlay-container');
      // if(eles.length > 0)
      //  eles[0].setAttribute('style','display:"none"');

    }
    else
      this.ytPlayer.playVideo();
  }

  rewind() {
    this.ytPlayer.seekTo(this.ytPlayer.getCurrentTime() - this.timeToJump, true)
  }
  
  forward() {
    this.ytPlayer.seekTo(this.ytPlayer.getCurrentTime() + this.timeToJump, true)
  }

  setCurrentTimeValue(value){
    this.ytPlayer.seekTo(value, true)
  }

  @Output() timeChanged = new EventEmitter<any>();
  timeUpdate(data) {
    this.videoPlayerCurrentTime = data.target.currentTime;
    this.timeChanged.emit(data.target.currentTime);
  }

  resizeCanvas() {

    const imgD =this.ctx.getImageData(0, 0, this.canvas.width - 1, this.canvas.height - 1); 

    this.canvas.width = this.divVideo.clientWidth
    this.canvas.height = this.divVideo.clientHeight

    this.ytPlayer.width = this.canvas.width
    this.ytPlayer.height = this.canvas.width / 1.7777

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
    this.previousPointSet = false;
    this.drawingMode = mode;
  }
  
  showDrawingPanel = false;
    setDrawingPanel(){
    this.showDrawingPanel = !this.showDrawingPanel
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
