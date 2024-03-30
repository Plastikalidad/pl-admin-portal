import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() public emitSearch$ = new EventEmitter<string>();

  public onChange(event: Event) {
    this.emitSearch$.emit((event.target as HTMLInputElement).value);
  }
}
