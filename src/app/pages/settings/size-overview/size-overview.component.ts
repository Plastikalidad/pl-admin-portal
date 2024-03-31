import { Component, ViewChild, inject } from '@angular/core';
import { SizeService } from '../../../firebase/services/size.service';
import { Size } from '../../../shared/interfaces/size.interface';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { GeneralService } from '../../../states/general.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AddSizeComponent } from '../../../modals/add-size/add-size.component';

@Component({
  selector: 'app-size-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddSizeComponent, ConfirmModalComponent],
  templateUrl: './size-overview.component.html',
  styleUrl: './size-overview.component.scss'
})
export class SizeOverviewComponent {
  @ViewChild('addSize') addSize: AddSizeComponent | undefined;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: ConfirmModalComponent | undefined;
  @ViewChild('confirmDeleteAllModal') confirmDeleteAllModal: ConfirmModalComponent | undefined;
  sizeService = inject(SizeService);
  public generalService = inject(GeneralService);
  public sizesToDelete: Size[] = [];
  public router = inject(Router);
  items$ = this.sizeService.getSizes();
  keys: Array<keyof Size> = ['code', 'value'];
  columns = ['Code', 'value'];
  actions = ['Add', 'Delete'];
  tableActions = ['Update', 'Delete'];


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addSize?.openModal();
        return;
      }
      case "Delete": {
        if (this.sizesToDelete.length) {
          this.confirmDeleteAllModal?.openModal({ title: 'Delete selected size', message: 'Are you sure you want to delete the selected size?' });
          return;
        }
        this.generalService.toast.set({ show: true, message: 'No size selected', type: 'alert-error' });
        return;
      }
    }
  }

  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "Update": {
        this.addSize?.openModal(true, data.item as Size);
        return;
      }

      case "Delete": {
        this.sizesToDelete.push(data.item as Size)
        this.confirmDeleteModal?.openModal({ title: 'Delete cap color', message: `Are you sure you want to delete cap color ${(data.item as Size).value}` });
        return;
      }

    }
  }

  public async deleteSize() {
    try {
      await this.sizeService.deleteSize(this.sizesToDelete[0]?.key);
      this.confirmDeleteModal?.closeModal();
      this.sizesToDelete = [];
      this.generalService.toast.set({ show: true, message: 'cap color deleted sucessfully', type: 'alert-success' });
    } catch (e) {

    }
  }

  public async deleteAllSizes() {
    try {
      for (let product of this.sizesToDelete) {
        await this.sizeService.deleteSize(product.key);
        this.confirmDeleteAllModal?.closeModal();
        this.sizesToDelete = [];
        this.generalService.toast.set({ show: true, message: 'Cap color deleted sucessfully', type: 'alert-success' });
      }
    } catch (e) {

    }
  }

  public clearsizesToDelete() {
    this.sizesToDelete = [];
  }

  public filterSizes(searchItem: string) {
    this.items$ = this.sizeService.getSizes(searchItem);
  }

  public onCheck(item: { value: boolean, data: unknown }) {
    if (Array.isArray(item.data)) {
      this.sizesToDelete = item.value ? item.data : []
    }
    else {
      if (item.value) {
        this.sizesToDelete.push(item.data as Size)
      }
      else {
        this.sizesToDelete = this.sizesToDelete.filter(product => product.key !== (item.data as Size).key);
      }
    }
  }
}
