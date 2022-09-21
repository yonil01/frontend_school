import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PDFDocumentProxy} from 'ng2-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pdf-visor',
  templateUrl: './pdf-visor.component.html',
  styleUrls: ['./pdf-visor.component.scss'],
  providers: [DatePipe],
})
export class PdfVisorComponent implements OnInit, AfterViewInit {
  @Input() src: string = '';
  @Input() type: string = '';
  @Input() nameDocument: string = '';
  // @ts-ignore
  @ViewChild('action') protected action: ElementRef<HTMLDivElement>;
  // @ts-ignore
  @ViewChild('canvas') protected canvas: ElementRef<HTMLCanvasElement>;
  public pdf!: PDFDocumentProxy;
  public mouseEnter = false;
  public zoom = 1;
  public rotation = 0;
  public outline: any;
  public numPages: number = 0;
  public actualPage = 1;
  public isShowDownload = false;
  public error: any;
  public srcSafeResourceUrl!: SafeResourceUrl;
  public nameDownload = '';

  constructor(private _domSanitizer: DomSanitizer, private datePipe: DatePipe) {}

  ngAfterViewInit(): void {
    if (!this.type || this.type === 'ng2') {
      this.action.nativeElement.onmouseenter = () => (this.mouseEnter = true);
      this.action.nativeElement.onmouseleave = () => (this.mouseEnter = false);
    }
  }

  ngOnInit(): void {
  if (this.type === 'ngx') {
      this.src = this.src.replace('data:application/pdf;base64,', '');
    }
  }

  nextPage() {
    if (this.actualPage < this.numPages) {
      this.actualPage++;
    }
  }

  backPage() {
    if (this.actualPage > 1) {
      this.actualPage--;
    }
  }

  reduce(): void {
    this.zoom = this.zoom - 0.2;
  }

  expand(): void {
    this.zoom = this.zoom + 0.2;
  }

  rotateRight(): void {
    this.rotation = this.rotation + 90;
  }

  rotateLeft(): void {
    this.rotation = this.rotation - 90;
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.numPages = pdf?.numPages;
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

  scrollUp(event: any): void {}
}
