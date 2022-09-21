import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {Visor} from '@app/core/components/visor';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-image-visor',
  templateUrl: './image-visor.component.html',
  styleUrls: ['./image-visor.component.scss'],
})
export class ImageVisorComponent extends Visor implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    const {src} = changes;
    if (src) {
      this.loadImage(src.currentValue).subscribe((data) => {
        const canvas = this.canvas.nativeElement;
        canvas.width = data.width;
        canvas.height = data.height;
        canvas.style.width = data.width + 'px';
        canvas.style.height = data.height + 'px';
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(data, 0, 0);
      });
    }
  }

  private loadImage(src: string) {
    const subject = new Subject<HTMLImageElement>();
    const img = new Image();
    img.src = src;
    img.onload = () => {
      subject.next(img);
      subject.complete();
    };
    return subject.asObservable();
  }
}
