import {AfterViewInit, Directive, ElementRef, Input, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Subject} from 'rxjs';
@Directive()
export class Visor implements AfterViewInit {
  protected scale = 1;

  @Input() src: string = '';
  @Input() nameDocument: string = '';
  // @ts-ignore
  @ViewChild('action') protected action: ElementRef<HTMLDivElement>;
  // @ts-ignore
  @ViewChild('canvas') protected canvas: ElementRef<HTMLCanvasElement>;

  mouseEnter = false;

  isShowDownload = false;
  error: any;
  srcSafeResourceUrl: SafeResourceUrl | undefined;
  nameDownload = '';

  constructor(private _domSanitizer: DomSanitizer) {
  }

  ngAfterViewInit(): void {
    this.action.nativeElement.onmouseenter = () => (this.mouseEnter = true);
    this.action.nativeElement.onmouseleave = () => (this.mouseEnter = false);
  }

  expand() {
    this.scale += 0.1;
    this.resizeCanvas();
  }

  reduce() {
    this.scale -= 0.1;
    this.resizeCanvas();
  }

  rotateRight() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const temp = this.getCanvasCopy(canvas);

    canvas.style.width = temp.height * this.scale + 'px';
    canvas.style.height = temp.width * this.scale + 'px';
    canvas.width = temp.height;
    canvas.height = temp.width;

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.rotate((90 * Math.PI) / 180);
    ctx?.translate(0, -canvas.width);
    ctx?.drawImage(temp, 0, 0);
  }

  rotateLeft() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const temp = this.getCanvasCopy(canvas);
    canvas.style.width = temp.height * this.scale + 'px';
    canvas.style.height = temp.width * this.scale + 'px';
    canvas.width = temp.height;
    canvas.height = temp.width;
    canvas.style.backgroundColor = 'green';
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.rotate((-90 * Math.PI) / 180);
    ctx?.translate(-temp.width, 0);
    ctx?.drawImage(temp, 0, 0);
  }

  protected loadBufferData(url: string) {
    const subject = new Subject<ProgressEvent<XMLHttpRequest>>();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    // @ts-ignore
    xhr.onload = (ev: ProgressEvent<XMLHttpRequest>) => {
      subject.next(ev);
      subject.complete();
    };
    xhr.send();
    return subject.asObservable();
  }

  private getCanvasCopy(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    if (imageData) {
      tmpCanvas.getContext('2d')?.putImageData(imageData, 0, 0);
    }
    return tmpCanvas;
  }

  private resizeCanvas() {
    const canvas = this.canvas.nativeElement;
    const nw = this.scale * canvas.width;
    const nh = this.scale * canvas.height;
    canvas.style.width = nw + 'px';
    canvas.style.height = nh + 'px';
  }

  cancelDownload(): void {
    this.isShowDownload = false;
  }

  closeDownload(): void {
    this.isShowDownload = false;
  }

  download(): void {
    this.srcSafeResourceUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.src);
    this.nameDownload = this.nameDocument;
    this.isShowDownload = true;
  }
}
