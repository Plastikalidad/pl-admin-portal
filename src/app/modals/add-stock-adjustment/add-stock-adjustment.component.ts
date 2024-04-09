import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DiscountService } from '../../firebase/services/discount.service';
import { ProductService } from '../../firebase/services/product.service';
import { RestockService } from '../../firebase/services/restock.service';
import { SizeService } from '../../firebase/services/size.service';
import { Discount } from '../../shared/interfaces/discount.interface';
import { KeyGeneratorService } from '../../shared/utils/key-generator.service';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { GeneralService } from '../../states/general.service';
import { CommonModule } from '@angular/common';
import { StockAdjustmentService } from '../../firebase/services/stock-adjustment.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Observable, forkJoin, take, tap } from 'rxjs';

@Component({
  selector: 'app-add-stock-adjustment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-stock-adjustment.component.html',
  styleUrl: './add-stock-adjustment.component.scss'
})
export class AddStockAdjustmentComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public discountService = inject(DiscountService);
  public stockService = inject(StockAdjustmentService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public productService = inject(ProductService);
  public sizeService = inject(SizeService);
  public date = '';


  public sizes = this.sizeService.getSizes();
  public products = this.productService.getProducts();
  public toUpdate = false;
  public discounts: Discount[] = []

  public ngOnInit(): void {
    this.discountService.getDiscounts().subscribe(discounts => {
      this.discounts = discounts;
    })
  }

  public form: FormGroup = this.fb.group({
    key: [''],
    date: ['', Validators.required],
    code: ['', [Validators.required]],
    products: this.fb.array([this.initializeProduct()]),
    notes: ['']
  });

  public initializeProduct() {
    return this.fb.group({
      key: [''],
      code: ['', Validators.required],
      design: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      availableStocks: [{ value: '', disabled: true }, Validators.required],
      regPricePerBundle: [{ value: '', disabled: true }, Validators.required],
      qtyPerBundle: [{ value: '', disabled: true }, Validators.required],
      addStock: ['', Validators.required],
    })
  }

  public getProducts() {
    return (this.form.get('products') as FormArray);
  }


  public addProduct() {
    (this.form.get('products') as FormArray).push(this.initializeProduct());
  }

  public deleteProduct(i: number) {
    (this.form.get('products') as FormArray).removeAt(i);
  }

  public onChangeCode(index: number) {
    const value = (this.form.get('products') as FormArray).get(index.toString())?.get('code')?.value;
    if (value) {
      this.productService.getProduct(value).subscribe(product => {
        (this.form.get('products') as FormArray).get(index.toString())?.patchValue(product[0]);
      })
    }
    else {
      (this.form.get('products') as FormArray).get(index.toString())?.reset();
    }
  }



  public openModal(update: boolean = false, data: Discount | null = null) {
    if (update && data) {
      this.toUpdate = true;
      this.form.patchValue(data)
    }
    else {
      this.toUpdate = false;
      this.form.get('code')?.setValue(this.generatorService.generateKey('SA'));
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
      this.addStocksToProducts();
      (this.dialogModal?.nativeElement as HTMLDialogElement).close()
    } catch (e) {
      (this.dialogModal?.nativeElement as HTMLDialogElement).close()
    }

  }

  public async addStocksToProducts() {
    const stockSubscription: Observable<any>[] = [];
    (this.form.get('products') as FormArray).controls.forEach((product) => {
      console.log(product)
      if (product) {
        stockSubscription.push(this.productService.getProduct(product.get('code')?.value).pipe(
          take(1),
          tap(async (data) => {
            const newStock = product.get('addStock')?.value
            await this.productService.updateProduct({ ...data[0], availableStocks: newStock })
            this.form.reset();
            return data;
          })))
      }
    })
    const subscription = forkJoin(stockSubscription).subscribe({
      next: async (d) => {
        await this.stockService.addStockAdjustment(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Adjustment successfully added', type: 'alert-success' });
        subscription.unsubscribe();
      },
      error: (e) => {
        subscription.unsubscribe();
      },
    })

    console.log(this.form.get('products'))
  }

  public onCancel() {
    this.form.reset();
    (this.dialogModal?.nativeElement as HTMLDialogElement).close()
  }
}
