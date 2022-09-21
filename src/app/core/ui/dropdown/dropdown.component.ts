import {
  AfterContentInit, AfterViewInit,
  ChangeDetectorRef,
  Component, ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output, QueryList, Renderer2, TemplateRef,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DropdownModel} from "./models/dropdown";
import {animate, style, transition, trigger} from "@angular/animations";
import {EcTemplateDirective} from "./directive/ec-template.directive";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'scaleY(0.8)'}),
        animate('{{showTransitionParams}}')
      ]),
      transition(':leave', [
        animate('{{hideTransitionParams}}', style({opacity: 0}))
      ])
    ])
  ]
})
export class DropdownComponent implements OnInit, ControlValueAccessor, AfterContentInit, AfterViewInit {
  @Input() multiple: boolean;
  @Input() isDisabled: boolean;
  @Input() filter: boolean = false;
  @Input() data: any[] = [];
  @Input() dropStyle: DropdownModel;
  @Input() icon: boolean = true;
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = '';
  @Input() onlyValue: boolean = true;
  @Input() placeholderOption: string = 'label';
  @Output() onChangeValue = new EventEmitter<any>();
  @Input() showClear: boolean = false;
  @Input() filterPlaceholder: string = 'Filtrar';
  @Input() valid: string = 'input-element';
  @ContentChildren(EcTemplateDirective) templates!: QueryList<any>;
  public selectedItemTemplate!: TemplateRef<any>;
  public itemTemplate!: TemplateRef<any>;
  public selectedOption: any;

  private _triggerRect!: ClientRect;
  private _transformOrigin: string = 'top';

  public positionOption: string = 'bottom';


  public showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';
  public hideTransitionOptions: string = '.1s linear';
  private _selectedCurrentValue: any;
  @ViewChild('dropdown') public dropdown!: ElementRef;
  @ViewChild('filter') public filterViewChild!: ElementRef;
  public placeholderValue: string = '';
  public isShowBox: boolean;
  public currentValue: any = '';
  public dataTemp: any = [];
  public dataMultiple: { active: boolean, item: any }[] = [];
  @Input() panelClass!: string | string[] | Set<string> | { [key: string]: any };


  public onChange = (_: any) => {
  }

  public onTouch = () => {
  }


  constructor(
    public renderer: Renderer2,
    public el: ElementRef,
    public cd: ChangeDetectorRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.isDisabled = false;
    this.isShowBox = false;
    this.multiple = false;
    this.dropStyle = {
      textColor: 'default-text-color',
      container: {
        background: 'default-container',
        border: {
          color: 'bg-mono-10',
          size: 'h-10',
          round: 'rounded-lg',
          style: '',
          hover: ''
        }
      },
      optionContainer: {
        background: 'default-option-container',
        border: {
          color: '',
          size: '',
          round: '',
          style: '',
          hover: ''
        }
      },
    };

    window.onresize = () => {
      this.verifyHeightContainer();
    };
  }

  ngAfterViewInit(): void {
    this.verifyHeightContainer();
  }

  ngOnInit(): void {
    if (this.multiple) {
      for (const item of this.data) {
        this.dataMultiple.push({active: false, item});
      }
    }
  }

  public verifyClickOut() {
    const documentTarget: any = this.dropdown ? this.dropdown.nativeElement.ownerDocument : 'document';
    this.renderer.listen(documentTarget, 'click', (event) => {
      if (this.dropdown && this.dropdown.nativeElement && !this.dropdown.nativeElement.contains(event.target) && this.isShowBox) {
        if (this.dataTemp.length > 0) this.data = this.dataTemp;
        this.isShowBox = false;
        this.onTouch();
      }
      this.cd.markForCheck();
    });
  }

  public focusComponent(event: any): void {
    event.stopPropagation();
    event.preventDefault();
    this.isShowBox = true;
  }

  public noSelectedValue(e: any): void {
    e.preventDefault();
  }

  public showBox(): void {
    this.isShowBox = !this.isShowBox;
    this.onTouch();
  }

  public changeValue(value: any): void {
    this.placeholderValue = this.placeholderOption === this.optionValue ? value[this.optionValue] : value[this.optionLabel];
    this.currentValue = this.onlyValue ? value[this.optionValue] : value;
    this._selectedCurrentValue = value;
    this.isShowBox = false;
    if (this.dataTemp.length > 0) this.data = this.dataTemp;
    this.onChangeValue.emit(this.currentValue);
    this.onTouch();
    this.onChange(this.currentValue);
  }

  public filterValue(value: any): void {
    const data = value.target.value;
    if (this.dataTemp.length > 0) {
      this.data = this.dataTemp;
    } else {
      this.dataTemp = this.data;
    }
    this.data = this.data?.filter((m: any) => {
      if (m.description.toLowerCase().indexOf(data) !== -1) return m;
    });
    if (data === '') this.data = this.dataTemp;
  }

  public clearValue(): void {
    this.currentValue = '';
    this.placeholderValue = '';
    if (this.multiple) {
      this.dataMultiple.forEach((item: any) => {
        item.active = false;
      });
    }
    this.onChangeValue.emit(this.currentValue);
    this._selectedCurrentValue = {};
    this.onTouch();
    this.onChange(this.currentValue);
  }

  public startAnimation(event: any): void {
    switch (event.toState) {
      case 'visible':
        this.verifyClickOut();

        if (this.filterViewChild && this.filterViewChild.nativeElement) {
          this.filterViewChild.nativeElement.focus();
        }
        this._triggerRect = this.dropdown.nativeElement.getBoundingClientRect();
        break;

      case 'void':
        break;
    }
  }

  public findSelectedValue(value: any): boolean {
    return this._selectedCurrentValue && this._selectedCurrentValue[this.optionValue] === value[this.optionValue];
  }

  public selectMultiple(event: boolean, item: any): void {
    if (event) {
      this.currentValue = this.currentValue === '' ? item[this.optionValue] : this.currentValue + ',' + item[this.optionValue];
      this.placeholderValue = this.placeholderValue === '' ? item[this.optionLabel] : this.placeholderValue + ',' + item[this.optionLabel];
      this.onChangeValue.emit(this.currentValue);
      this.onTouch();
      this.onChange(this.currentValue);
    } else {
      const dataArray = this.currentValue.split(',');
      this.currentValue = dataArray.filter((m: any) => m !== item[this.optionValue]).join(',');
      const dataArrayLabel = this.placeholderValue.split(',');
      this.placeholderValue = dataArrayLabel.filter((m: any) => m !== item[this.placeholderOption === this.optionValue ? this.optionValue : this.optionLabel]).join(',');
      this.onChangeValue.emit(this.currentValue);
      this.onTouch();
      this.onChange(this.currentValue);
    }
  }

  public updateSelectionData(value: string): void {
    const dataArray = value.split(',');
    this.currentValue = value;
    this.dataMultiple = [];
    for (const item of this.data) {
      const itemFind = dataArray.find((m: any) => m === item[this.optionValue]);
      if (itemFind) {
        this.placeholderValue += this.placeholderValue !== '' ? ',' + item[this.placeholderOption === this.optionValue ? this.optionValue : this.optionLabel] : item[this.placeholderOption === this.optionValue ? this.optionValue : this.optionLabel];
        this.dataMultiple.push({active: true, item});
      } else {
        this.dataMultiple.push({active: false, item});
      }
    }
  }

  private verifyHeightContainer(): void {
    const heightOption = this.dropdown.nativeElement.getBoundingClientRect().top + 416;
    if (heightOption >= window.screen.height) {
      this.positionOption = 'top';
    } else {
      this.positionOption = 'bottom';
    }
  }

  writeValue(value: any): void {
    let findValue
    if (value !== null && value !== undefined) {
      if (!this.multiple) {
        if (this.data) {
          findValue = this.data.find((m: any) => m[this.optionValue] === value)
        } else {
          findValue = undefined;
        }
        if (findValue) {
          this.currentValue = this.onlyValue ? findValue[this.optionValue] : findValue;
          this._selectedCurrentValue = findValue;
          this.placeholderValue = this.placeholderOption === this.optionValue ? findValue[this.optionValue] : findValue[this.optionLabel];
        } else {
          this.currentValue = value;
          this.placeholderValue = value;
        }
      } else {
        this.updateSelectionData(value);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'item':
          this.itemTemplate = item.template;
          break;

        case 'selectedItem':
          this.selectedItemTemplate = item.template;
          break;

        case 'header':
          console.log(item.template)
          break;

        case 'footer':
          console.log(item.template)
          break;

        case 'emptyfilter':
          console.log(item.template)
          break;

        case 'empty':
          console.log(item.template)
          break;

        case 'group':
          console.log(item.template)
          break;

        default:
          this.itemTemplate = item.template;
          break;
      }
    });
  }
}
