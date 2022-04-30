import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {DocTypes, DoctypeEntities, Entity} from '@app/core/models';
import {EntityService} from '@app/modules/wizard/services/entity/entity.service';
import {DoctypegroupService} from '@app/modules/wizard/services/doctypegroup/doctypegroup.service';
import {v4 as uuidv4} from 'uuid';
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-doc-entity',
  templateUrl: './doc-entity.component.html',
  styleUrls: ['./doc-entity.component.scss'],
})
export class DocEntityComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  private project: any;
  private sourceEntities: Entity[] = [];
  public targetEntities: Entity[] = [];
  public sourceNewEntities: Entity[] = [];

  @Input() dataDoctype!: DocTypes;
  @Output() cancelAndReturn = new EventEmitter<any>();

  public isBlockPage: boolean = false;

  constructor(
    private entityService: EntityService,
    private doctypegroupService: DoctypegroupService,
    private messageService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    console.log(this.dataDoctype);
    this.getEntities(this.dataDoctype);
    console.log(this.dataDoctype);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getEntities(dat: DocTypes): void {
    this.isBlockPage = true;
    this.entityService.getEntitiesByProject(this.project.id).subscribe({
      next: (res) => {
        if (res.error) {
          this.messageService.add({type: 'error', message: res.msg, life: 5000})
        } else {
          if (res.data) {
            this.sourceEntities = res.data;
            if (dat?.doctypes_entities) {
              for (const entity of this.sourceEntities) {
                const info = Object(dat.doctypes_entities);
                const ent = info.find((e: any) => e.entities.id.toLowerCase() === entity.id?.toLowerCase());
                if (ent) {
                  this.targetEntities.push(entity);
                } else {
                  this.sourceNewEntities.push(entity);
                }
              }
            } else {
              this.sourceNewEntities = this.sourceEntities;
            }
          } else {
            this.messageService.add({
              type: 'info',
              message: 'No se encontraron entidades realacionadas al proyecto!',
              life: 5000
            })
          }
        }
        this.isBlockPage = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.isBlockPage = false;
        this.messageService.add({type: 'error', message: err.message, life: 5000});
      }
    });
  }

  public selectTargetEntity(items: string[]): void {
    const doctypeEntidad: any[] = [];
    for (const id of items) {
      let sequence = 1;
      if (this.dataDoctype.doctypes_entities && this.dataDoctype.doctypes_entities.length) {
        // @ts-ignore
        sequence = this.dataDoctype.doctypes_entities[this.dataDoctype.doctypes_entities.length - 1].sequence + 1
      }
      const doctypeEntities: DoctypeEntities = {
        id: uuidv4().toLowerCase(),
        doctypes_id: this.dataDoctype.id?.toLocaleLowerCase(),
        entities_id: id,
        sequence
      };
      doctypeEntidad.push(doctypeEntities);
    }
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.createDoctypeEntities(doctypeEntidad).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            for (const doc of doctypeEntidad) {
              const entity = this.sourceEntities.find(d => d.id === doc.entities_id);
              if (entity) {
                Object.assign(doc, {entities: entity});
                this.dataDoctype.doctypes_entities?.push(doc);
                this.targetEntities.push(entity);
                this.sourceNewEntities = this.sourceNewEntities.filter(d => d.id !== entity.id);
              }
            }
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.messageService.add({type: 'error', message: err.message, life: 5000});
          this.isBlockPage = false;
        }
      })
    );
  }

  public selectSourceEntity(items: string[]): void {
    for (const id of items) {
      const doctypeEntityID = this.dataDoctype.doctypes_entities?.find(d => d.entities?.id === id)?.id;
      if (doctypeEntityID) {
        this.isBlockPage = true;
        this._subscription.add(
          this.doctypegroupService.deleteDoctypeEntitiesById(doctypeEntityID).subscribe({
            next: (res) => {
              if (res.error) {
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this.messageService.add({type: 'success', message: res.msg, life: 5000});
                this.dataDoctype.doctypes_entities = this.dataDoctype.doctypes_entities?.filter(d => d.id !== doctypeEntityID);
                this.targetEntities = this.targetEntities.filter((entityItem) => entityItem.id?.toLowerCase() !== id.toLowerCase());
                const doc = this.sourceEntities.find((doc) => doc.id?.toLowerCase() === id.toLowerCase());
                if (doc) {
                  this.sourceNewEntities.push(doc);
                }
              }
              this.isBlockPage = false;
            },
            error: (err: HttpErrorResponse) => {
              console.error(err);
              this.messageService.add({type: 'error', message: err.message, life: 5000});
              this.isBlockPage = false;
            }
          })
        );
      }
    }
  }

  public cancel(): void {
    this.cancelAndReturn.emit();
  }

}
