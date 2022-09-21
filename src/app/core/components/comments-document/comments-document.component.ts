import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {Comment} from '@app/core/models/doc/comment';
import {FormControl} from '@angular/forms';
import {Document, Token, Process, Queue} from '@app/core/models';
import {TokenService} from '@app/core/services/graphql/token/token.service';

@Component({
  selector: 'app-comments-document',
  templateUrl: './comments-document.component.html',
  styleUrls: ['./comments-document.component.scss'],
})
export class CommentsDocumentComponent implements OnInit, OnChanges {
  @Input() document: Document = {};
  comments: Comment[] = [];
  commentForm = new FormControl('');
  comment: Comment = {};
  commentListbox: any = [];
  user = '';
  token: Token = {};
  tokens: Token[] = [];
  selectedProcess: Process = {};
  selectedQueue: Queue = {};
  selectedCommentForm = new FormControl('');
  showInfoIndex: number = 0;
  keyPress = '';
  shiftKey = false;

  constructor(
    private localStorage: LocalStorageService,
    private store: Store<AppState>,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.localStorage.getUserId();
    this.store.select('doctypeGroup').subscribe((state) => {
      this.tokens = state.tokens;
      this.selectedProcess = state.selectedProcess;
      this.selectedQueue = state.selectedQueue;

      this.commentListbox = this.selectedQueue?.comments ? this.selectedQueue?.comments.map((cm) => ({comment: cm})) : [];
    });
  }

  ngOnChanges(): void {
    this.getInitiData();
  }

  private getInitiData(): void {
    this.comments = [];
    if (this.document) {
      this.tokenService.getCommentByDocument(this.document.id?.toString() || '').subscribe((res) => {
        if (res.data && !res.error) {
          this.comments = res.data;
          this.comments = Object.values(this.comments).sort((a: any, b: any) =>
            new Date(a.created_at) > new Date(b.created_at)
              ? 1
              : new Date(a.created_at) < new Date(b.created_at)
                ? -1
                : 0,
          );
        }
      });
    }
  }

  openComment(index: number): void {
    if (this.showInfoIndex === index) {
      this.showInfoIndex = -1;
    } else {
      this.showInfoIndex = index;
    }
  }

  selectedComment(): void {
    this.commentForm.setValue(this.selectedCommentForm.value.comment);
  }

  onInput(): void {
    if (this.commentForm.value === '\n') {
      this.commentForm.setValue('');
    }
    if (this.commentForm.value !== '' && this.keyPress === 'Enter' && !this.shiftKey) {
      const comment = this.commentForm.value.substring(0, this.commentForm.value.length);
      this.commentForm.setValue(comment);
      this.saveComment();
    }
  }

  onKeypress(event: any): void {
    this.keyPress = event.key;
    this.shiftKey = event.shiftKey;
  }

  saveComment(): void {
    if (this.commentForm.value !== '') {
      this.token = this.tokens.find((t) => t.document === this.document.id) || {};
      const comment = {
        document_id: this.token.document?.toString(),
        token: this.token.id?.toString(),
        process_id: this.selectedProcess?.id?.toLowerCase(),
        queue_id: this.token.queue?.toLowerCase(),
        value: this.commentForm.value,
      };
      this.tokenService.createComment(comment).subscribe((res) => {
        if (res.error) {
          this.notifyUser('error', '', res.msg, 5000);
        } else {
          this.notifyUser('success', '', res.msg, 5000);
          this.getInitiData();
        }
      });
    }
    this.commentForm.setValue('');
    this.selectedCommentForm.setValue('');
  }

  private notifyUser(severity: string, summary: string, detail: string, life: number): void {
    /*this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life,
    });*/
  }
}
