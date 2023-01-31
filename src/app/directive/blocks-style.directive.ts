import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appBlocksStyle]',
  host: {
    '(document:keyup)': 'initKeyUp($event)',
  },
  exportAs: 'blockStyle'
})
export class BlocksStyleDirective  implements OnInit, AfterViewInit, OnChanges {

  @Input() selector: string;
  @Input() initFirst: boolean;

  @Output() renderComplete = new EventEmitter();

  private items: HTMLElement[];
  private index: number = 0;
  public activeElementIndex: number;
  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activeElementIndex = 0
    if (this.selector) {
      this.items = this.el.nativeElement.querySelectorAll(this.selector);
      if (this.initFirst) {
        if (this.items[0]) {
          (this.items[0] as HTMLElement).setAttribute('style', 'border: 2px solid red')
        }
      }
    } else {
      console.error("Не передан селектор")
    }

    setTimeout( ()=> {
      this.renderComplete.emit(true);
    })
  }

  ngOnChanges(data: SimpleChanges) {

  }

  initKeyUp(ev: KeyboardEvent): void {

    const prevIndex=this.index;

    if (ev.key === 'ArrowRight') {
      this.index++;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red')
      }
    } else if (ev.key === 'ArrowLeft') {
      this.index--;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red')
      }
    } else if (ev.key === 'ArrowDown') {
        this.index=this.index+3;
        if (this.items[this.index]) {
          (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red')
          // console.log("newIndex",this.index);
          }
        }
    else if (ev.key === 'ArrowUp') {
      this.index=this.index-3;
      if (this.items[this.index]) {
        (this.items[this.index] as HTMLElement).setAttribute('style', 'border: 2px solid red')
        console.log("newIndex",this.index);
      }
    }
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      if ( this.items[this.index] ) {  // хочу, чтобы он снимал выделение с блока, только если этот блок существует
      (this.items[prevIndex] as HTMLElement).removeAttribute('style');
      } else
        this.index = prevIndex;
    }

    this.activeElementIndex = this.index;
 }

  initStyle( index: number) {
    this.index = index;
    this.activeElementIndex = this.index;
    if (this.items[index]){
      (this.items[index] as HTMLElement).setAttribute('style', 'border: 2px solid red')
    }
  }

  updateItems(): void {
    this.items = this.el.nativeElement.querySelectorAll(this.selector);
  }

}
