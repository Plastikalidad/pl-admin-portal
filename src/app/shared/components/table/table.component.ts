import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  public pageNumber: number = 1;
  public itemsPerPage: number = 5;

  @Output() emitAction$ = new EventEmitter<string>();

  public onActionClick(action: string) {
    this.emitAction$.emit(action);
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
}
