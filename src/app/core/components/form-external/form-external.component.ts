import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AppState} from '@app/core/store/app.reducers';
import {Store} from '@ngrx/store';
import {Document, Queue} from '@app/core/models';

@Component({
  selector: 'app-form-external',
  templateUrl: './form-external.component.html',
  styleUrls: ['./form-external.component.scss'],
})
export class FormExternalComponent implements OnInit {
  @Input() urlPath: string = '';
  @Input() document: any;
  @Input() documentForValues: Document = {};
  @Input() queue: Queue = {};
  @Input() doctype: any = {};
  public urlForm!: SafeResourceUrl;

  constructor(private _domSanitizer: DomSanitizer, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('access-token');
    if (this.document) {
      const url = this.urlPath;
      const doctype = this.document.doctype ? this.document.doctype : this.doctype;
      const queue = this.queue ? this.queue.name : '';
      const document = this.document.id;

      const urlConcat = url + '?' + 'doctype=' + doctype?.id + '&queue=' + queue + '&document=' + document + '&token=' + token;
      this.urlForm = this._domSanitizer.bypassSecurityTrustResourceUrl(urlConcat);
    } else {
      const url = this.urlPath;
      const queue = '';
      const document = '';
      const documentforvalues = this.documentForValues ? this.documentForValues.id : '';
      const urlConcat = url + '&queue=' + queue + '&document=' + document + '&token=' + token + '&documentforvalues=' + documentforvalues;
      this.urlForm = this._domSanitizer.bypassSecurityTrustResourceUrl(urlConcat);
    }
  }
}
