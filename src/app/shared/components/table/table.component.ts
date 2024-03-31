import { Component, ElementRef, EventEmitter, Input, Output, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> {
  @Input() items: T[] = [];
  @Input() columns: string[] = [];
  @Input() keys: Array<keyof T> = [];
  @Input() actions: string[] = [];
  @Input() showCheckboxColumn = true;
  @Output() onCheck$ = new EventEmitter<{ value: boolean, data: 'all' | T }>();
  @Output() emitAction$ = new EventEmitter<{ action: string, item: T }>();
  @ViewChildren('checkbox')
  checkbox!: ElementRef[];
  public pageNumber: number = 1;
  public itemsPerPage: number = 5;


  public onActionClick(action: string, item: T) {
    this.emitAction$.emit({ action, item });
  }

  public paginate(array: any) {
    let pageNumberInit = 1;

    pageNumberInit = this.pageNumber;
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((pageNumberInit - 1) * this.itemsPerPage, pageNumberInit * this.itemsPerPage);
  }

  public checkPaginate(array: any) {
    let pageNumberInit = 1;
    pageNumberInit = this.pageNumber + 1;
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((pageNumberInit - 1) * this.itemsPerPage, pageNumberInit * this.itemsPerPage);
  }

  public onCheck(event: Event, data: 'all' | T) {
    const value = (event.target as HTMLInputElement).checked;
    if (data === 'all') {
      this.toggleCheckAll(value);
      this.onCheck$.emit({ value, data: this.paginate(this.items) });
    }
    else {
      this.onCheck$.emit({ value, data });
    }
  }

  public toggleCheckAll(value: boolean) {
    this.checkbox.forEach(e => {
      (e.nativeElement as HTMLInputElement).checked = value;
    });

  }
}
