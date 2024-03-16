import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss'
})
export class ActionMenuComponent {
  @Input() actions: string[] = [];
  @Output() emitAction$ = new EventEmitter<string>();

  onClick(action: string) {
    this.emitAction$.emit(action);
  }
}
