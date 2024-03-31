import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../states/general.service';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { SizeService } from '../../firebase/services/size.service';
import { KeyGeneratorService } from '../../shared/utils/key-generator.service';
import { Size } from '../../shared/interfaces/size.interface';

@Component({
  selector: 'app-add-size',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-size.component.html',
  styleUrl: './add-size.component.scss'
})
export class AddSizeComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public sizeService = inject(SizeService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public toUpdate = false;

  public form: FormGroup = this.fb.group({
    key: [''],
    code: ['', [Validators.required]],
    value: ['', [Validators.required]],
  });



  public openModal(update: boolean = false, data: Size | null = null) {
    if (update && data) {
      this.toUpdate = true;
      this.form.patchValue(data)
    }
    else {
      this.toUpdate = false;
      this.form.get('code')?.setValue(this.generatorService.generateKey('S'));
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
        await this.sizeService.updateSize(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Size successfully updated', type: 'alert-success' });
      }
      else {

        await this.sizeService.addSize(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Size successfully added', type: 'alert-success' });
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
