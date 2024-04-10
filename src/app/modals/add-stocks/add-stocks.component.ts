import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../states/general.service';
import { ValidatorsService } from '../../shared/utils/validators.service';
import { DiscountService } from '../../firebase/services/discount.service';
import { KeyGeneratorService } from '../../shared/utils/key-generator.service';
import { Discount } from '../../shared/interfaces/discount.interface';
import { SizeService } from '../../firebase/services/size.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../firebase/services/product.service';
import { RestockService } from '../../firebase/services/restock.service';


@Component({
  selector: 'app-add-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-stocks.component.html',
  styleUrl: './add-stocks.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddStocksComponent implements OnInit {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public discountService = inject(DiscountService);
  public stockService = inject(RestockService);
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
    date: [''],
    code: ['', [Validators.required]],
    products: this.fb.array([this.initializeProduct()]),
    totalPrice: ['', Validators.required],
    status: ['Pending']
  });

  public initializeProduct() {
    return this.fb.group({
      key: [''],
      code: ['', Validators.required],
      design: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      capColors: [{ value: '', disabled: true }, Validators.required],
      availableStocks: [{ value: '', disabled: true }, Validators.required],
      regPricePerBundle: [{ value: '', disabled: true }, Validators.required],
      qtyPerBundle: [{ value: '', disabled: true }, Validators.required],
      addStock: ['', Validators.required],
      totalPrice: [{ value: '', disabled: true }, Validators.required],
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
    this.totalPrice();
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

  public computeProductPrice(index: number) {
    const regPricePerBundle = (this.form.get('products') as FormArray).get(index.toString())?.get('regPricePerBundle')?.getRawValue();
    const qtyPerBundle = (this.form.get('products') as FormArray).get(index.toString())?.get('qtyPerBundle')?.getRawValue();
    const addStock = (this.form.get('products') as FormArray).get(index.toString())?.get('addStock')?.value;
    const price = (regPricePerBundle / qtyPerBundle) * addStock;
    (this.form.get('products') as FormArray).get(index.toString())?.get('totalPrice')?.setValue(price);
    this.totalPrice();

  }

  public totalPrice() {
    let totalPrice = 0
    for (let product of this.getProducts().controls) {
      totalPrice += product.get('totalPrice')?.getRawValue();
    }
    this.form.get('totalPrice')?.setValue(this.computeDiscount(totalPrice));
    this.computeDiscount(totalPrice);
  }

  public computeDiscount(totalPrice: number) {
    const discountUsed = this.discounts.find(discount => discount.fromPrice <= totalPrice && discount.toPrice >= totalPrice);
    if (discountUsed) {
      if (discountUsed.discountOne)
        totalPrice = totalPrice - (totalPrice * (discountUsed.discountOne * .01))
      if (discountUsed.discountTwo)
        totalPrice = totalPrice - (totalPrice * (discountUsed.discountTwo * .01))
      if (discountUsed.discountThree)
        totalPrice = totalPrice - (totalPrice * (discountUsed.discountThree * .01))
      if (discountUsed.discountFour)
        totalPrice = totalPrice - (totalPrice * (discountUsed.discountFour * .01))
    }
    return totalPrice.toFixed(2);
  }

  public openModal(update: boolean = false, data: Discount | null = null) {
    if (update && data) {
      this.toUpdate = true;
      this.form.patchValue(data)
    }
    else {
      this.toUpdate = false;
      this.form.get('code')?.setValue(this.generatorService.generateKey('R'));
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
        await this.stockService.updateRestock(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Restock successfully updated', type: 'alert-success' });
      }
      else {

        await this.stockService.addRestock(this.form.getRawValue());
        this.generalService.toast.set({ show: true, message: 'Restock successfully added', type: 'alert-success' });
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
