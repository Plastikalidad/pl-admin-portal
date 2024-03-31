import { Component, ViewChild, inject } from '@angular/core';
import { CapColorService } from '../../../firebase/services/cap-color.service';
import { CapColor } from '../../../shared/interfaces/cap-color.interface';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { GeneralService } from '../../../states/general.service';
import { Router } from '@angular/router';
import { AddCapColorComponent } from '../../../modals/add-cap-color/add-cap-color.component';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from '../../../shared/components/action-menu/action-menu.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-cap-color-overview',
  standalone: true,
  imports: [CommonModule, TableComponent, ActionMenuComponent, SearchComponent, AddCapColorComponent, ConfirmModalComponent],
  templateUrl: './cap-color-overview.component.html',
  styleUrl: './cap-color-overview.component.scss'
})
export class CapColorOverviewComponent {
  @ViewChild('addCapColor') addCapColor: AddCapColorComponent | undefined;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: ConfirmModalComponent | undefined;
  @ViewChild('confirmDeleteAllModal') confirmDeleteAllModal: ConfirmModalComponent | undefined;
  capColorService = inject(CapColorService);
  public generalService = inject(GeneralService);
  public capColorsToDelete: CapColor[] = [];
  public router = inject(Router);
  items$ = this.capColorService.getCapColors();
  keys: Array<keyof CapColor> = ['code', 'value'];
  columns = ['Code', 'value'];
  actions = ['Add', 'Delete'];
  tableActions = ['Update', 'Delete'];


  public executeAction(action: string) {
    switch (action) {
      case "Add": {
        this.addCapColor?.openModal();
        return;
      }
      case "Delete": {
        if (this.capColorsToDelete.length) {
          this.confirmDeleteAllModal?.openModal({ title: 'Delete selected cap colors', message: 'Are you sure you want to delete the selected capColors?' });
          return;
        }
        this.generalService.toast.set({ show: true, message: 'No cap colors selected', type: 'alert-error' });
        return;
      }
    }
  }

  public executeTableAction(data: { action: string, item: unknown }) {
    switch (data.action) {
      case "Update": {
        this.addCapColor?.openModal(true, data.item as CapColor);
        return;
      }

      case "Delete": {
        this.capColorsToDelete.push(data.item as CapColor)
        this.confirmDeleteModal?.openModal({ title: 'Delete cap color', message: `Are you sure you want to delete cap color ${(data.item as CapColor).value}` });
        return;
      }

    }
  }

  public async deleteCapColor() {
    try {
      await this.capColorService.deleteCapColor(this.capColorsToDelete[0]?.key);
      this.confirmDeleteModal?.closeModal();
      this.capColorsToDelete = [];
      this.generalService.toast.set({ show: true, message: 'cap color deleted sucessfully', type: 'alert-success' });
    } catch (e) {

    }
  }

  public async deleteAllCapColors() {
    try {
      for (let product of this.capColorsToDelete) {
        await this.capColorService.deleteCapColor(product.key);
        this.confirmDeleteAllModal?.closeModal();
        this.capColorsToDelete = [];
        this.generalService.toast.set({ show: true, message: 'Cap color deleted sucessfully', type: 'alert-success' });
      }
    } catch (e) {

    }
  }

  public clearcapColorsToDelete() {
    this.capColorsToDelete = [];
  }

  public filterCapColors(searchItem: string) {
    this.items$ = this.capColorService.getCapColors(searchItem);
  }

  public onCheck(item: { value: boolean, data: unknown }) {
    if (Array.isArray(item.data)) {
      this.capColorsToDelete = item.value ? item.data : []
    }
    else {
      if (item.value) {
        this.capColorsToDelete.push(item.data as CapColor)
      }
      else {
        this.capColorsToDelete = this.capColorsToDelete.filter(product => product.key !== (item.data as CapColor).key);
      }
    }
  }
}
