import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @ViewChild('modal') modal: ElementRef | undefined;
  @Input() public message: string = '';
  @Input() public title: string = '';
  @Output() public emitSubmit$ = new EventEmitter<void>();

  public openModal(setting: { title: string, message: string }) {
    this.title = setting.title;
    this.message = setting.message;
    this.modal?.nativeElement.showModal()
  }

  public onSubmit() {
    this.emitSubmit$.emit();
  }

  public closeModal() {
    (this.modal?.nativeElement as HTMLDialogElement).close();
  }

  public onCancel() {
    (this.modal?.nativeElement as HTMLDialogElement).close()
  }

}
