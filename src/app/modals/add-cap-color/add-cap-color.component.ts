import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../states/general.service';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { CapColorService } from '../../firebase/services/cap-color.service';
import { KeyGeneratorService } from '../../shared/utils/key-generator.service';
import { CapColor } from '../../shared/interfaces/cap-color.interface';

@Component({
  selector: 'app-add-cap-color',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-cap-color.component.html',
  styleUrl: './add-cap-color.component.scss'
})
export class AddCapColorComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public capColorService = inject(CapColorService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public toUpdate = false;

  public form: FormGroup = this.fb.group({
    key: [''],
    code: ['', [Validators.required]],
    value: ['', [Validators.required]],
  });



  public openModal(update: boolean = false, data: CapColor | null = null) {
    if (update && data) {
      this.toUpdate = true;
      this.form.patchValue(data)
    }
    else {
      this.toUpdate = false;
      this.form.get('code')?.setValue(this.generatorService.generateKey('CC'));
    }
    this.form.get('code')?.disable();
    this.dialogModal?.nativeElement.showModal()
  }

  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {
      if (this.toUpdate) {
        await this.capColorService.updateCapColor(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Cap Color successfully updated', type: 'alert-success' });
      }
      else {

        await this.capColorService.addCapColor(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Cap Color successfully added', type: 'alert-success' });
      }
      this.form.reset();
      (this.dialogModal?.nativeElement as HTMLDialogElement).close()
    } catch (e) {
      (this.dialogModal?.nativeElement as HTMLDialogElement).close()
    }

  }

  public onCancel() {
    this.form.reset();
    (this.dialogModal?.nativeElement as HTMLDialogElement).close()
  }
}
