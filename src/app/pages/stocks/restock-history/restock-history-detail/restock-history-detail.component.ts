import { Component, ViewChild, ElementRef, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DiscountService } from "../../../../firebase/services/discount.service";
import { ProductService } from "../../../../firebase/services/product.service";
import { RestockService } from "../../../../firebase/services/restock.service";
import { SizeService } from "../../../../firebase/services/size.service";
import { Discount } from "../../../../shared/interfaces/discount.interface";
import { KeyGeneratorService } from "../../../../shared/utils/key-generator.service";
import { ValidatorsService } from "../../../../shared/utils/validators.service";
import { GeneralService } from "../../../../states/general.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";


@Component({
  selector: 'app-restock-history-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './restock-history-detail.component.html',
  styleUrl: './restock-history-detail.component.scss'
})
export class RestockHistoryDetailComponent implements OnInit {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public router = inject(Router);
  public generalService = inject(GeneralService);
  public discountService = inject(DiscountService);
  public stockService = inject(RestockService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public productService = inject(ProductService);
  public sizeService = inject(SizeService);
  public activatedRoute = inject(ActivatedRoute);
  public code = this.activatedRoute.snapshot.params['code'];
  public date = '';


  public sizes = this.sizeService.getSizes();
  public products = this.productService.getProducts();
  public discounts: Discount[] = []

  public ngOnInit(): void {
    this.discountService.getDiscounts().subscribe(discounts => {
      this.discounts = discounts;
    });
    this.stockService.getRestock(this.code).pipe(take(1)).subscribe(restock => {
      const products: { code: string; design: string; size: string; availableStocks: number; addStock: number; regPricePerBundle: number; qtyPerBundle: number; }[] = [];
      Object.keys(restock[0].products).forEach((key: string) => {
        products.push(restock[0].products[parseInt(key)])
      });
      restock[0].products = products;
      for (let product of products) {
        this.addProduct()
      }
      this.form.patchValue(restock[0]);
    });
  }

  public form: FormGroup = this.fb.group({
    key: [''],
    date: [{ value: '', disabled: true }],
    code: [{ value: '', disabled: true }, [Validators.required]],
    products: this.fb.array([]),
    totalPrice: ['', Validators.required],
    notes: [''],
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



  public async onSubmit() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }
    try {

      await this.stockService.updateRestock(this.form.getRawValue());
      this.generalService.toast.set({ show: true, message: 'Restock successfully updated', type: 'alert-success' });
    } catch (e) {
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

  public onCancel() {
    this.router.navigate(['restock-history']);
  }
}
