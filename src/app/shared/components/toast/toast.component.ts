import { Component, inject } from '@angular/core';
import { GeneralService } from '../../../states/general.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  generalService = inject(GeneralService);


  public close() {
    this.generalService.toast.set({ show: false, message: '', type: 'alert-info' })
  }

}
