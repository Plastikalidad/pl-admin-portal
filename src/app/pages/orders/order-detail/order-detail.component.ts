import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../../firebase/services/customer.service';
import { DiscountService } from '../../../firebase/services/discount.service';
import { OrderService } from '../../../firebase/services/order.service';
import { ProductService } from '../../../firebase/services/product.service';
import { SizeService } from '../../../firebase/services/size.service';
import { Discount } from '../../../shared/interfaces/discount.interface';
import { KeyGeneratorService } from '../../../shared/utils/key-generator.service';
import { ValidatorsService } from '../../../shared/utils/validators.service';
import { GeneralService } from '../../../states/general.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  @ViewChild('dialogModal') dialogModal: ElementRef | undefined;
  public fb = inject(FormBuilder);
  public generalService = inject(GeneralService);
  public discountService = inject(DiscountService);
  public orderService = inject(OrderService);
  public validatorsService = inject(ValidatorsService);
  public generatorService = inject(KeyGeneratorService);
  public productService = inject(ProductService);
  public customerService = inject(CustomerService);
  public sizeService = inject(SizeService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);
  public code = this.activatedRoute.snapshot.params['code'];
  public date = '';


  public sizes = this.sizeService.getSizes();
  public customers = this.customerService.getCustomers();
  public products = this.productService.getProducts();
  public toUpdate = false;
  public discounts: Discount[] = []

  public ngOnInit(): void {
    this.discountService.getDiscounts().subscribe(discounts => {
      this.discounts = discounts;
    });
    this.orderService.getOrder(this.code).pipe(take(1)).subscribe(order => {
      console.log(order)
      const products: { code: string; design: string; size: string; availableStocks: number; quantity: number; regPricePerBundle: number; qtyPerBundle: number; }[] = [];
      Object.keys(order[0].products).forEach((key: string) => {
        products.push(order[0].products[parseInt(key)])
      });
      order[0].products = products;
      for (let product of products) {
        this.addProduct()
      }
      this.form.patchValue(order[0]);
    });
  }

  public form: FormGroup = this.fb.group({
    key: [''],
    date: [''],
    code: [{ value: '', disabled: true }, [Validators.required]],
    customer: this.fb.group({
      code: [''],
      firstName: [''],
      lastName: [''],
      contactNumber: [''],
      address: [''],
      modeOfPayment: [''],
      modeOfDelivery: [''],
      orderedFrom: ['']
    }),
    notes: [''],
    products: this.fb.array([]),
    totalPrice: ['', Validators.required],
    status: ['Reserved']
  });

  public initializeProduct() {
    return this.fb.group({
      key: [''],
      code: ['', Validators.required],
      design: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      availableStocks: [{ value: '', disabled: true }, Validators.required],
      sellingPrice: [{ value: '', disabled: true }, Validators.required],
      qtyPerBundle: [{ value: '', disabled: true }, Validators.required],
      quantity: ['', Validators.required],
      totalPrice: [{ value: '', disabled: true }, Validators.required],
      sellingPricePer50: [{ value: '', disabled: true }, Validators.required],
      sellingPricePer100: [{ value: '', disabled: true }, Validators.required],
      sellingPricePer500: [{ value: '', disabled: true }, Validators.required]
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

  public onChangeCustomerCode() {
    const value = (this.form.get('customer') as FormGroup).get('code')?.value;
    if (value) {
      this.customerService.getCustomer(value).subscribe(customer => {
        (this.form.get('customer') as FormGroup)?.patchValue(customer[0]);
      })
    }
    else {
      (this.form.get('customer') as FormGroup)?.reset();
    }
  }

  public computeProductPrice(index: number) {
    const sellingPricePer100 = (this.form.get('products') as FormArray).get(index.toString())?.get('sellingPricePer100')?.getRawValue();
    const sellingPricePer50 = (this.form.get('products') as FormArray).get(index.toString())?.get('sellingPricePer50')?.getRawValue();
    const sellingPricePer500 = (this.form.get('products') as FormArray).get(index.toString())?.get('sellingPricePer500')?.getRawValue();
    const quantity = (this.form.get('products') as FormArray).get(index.toString())?.get('quantity')?.value;
    let sellingPrice = 0
    if (quantity >= 1 && quantity < 100) {
      sellingPrice = sellingPricePer50;
    }
    else if (quantity >= 100 && quantity < 500) {
      sellingPrice = sellingPricePer100;
    }
    else if (quantity >= 500) {
      sellingPrice = sellingPricePer500;

    }
    const price = sellingPrice * quantity;
    (this.form.get('products') as FormArray).get(index.toString())?.get('totalPrice')?.setValue(price);
    this.totalPrice();

  }

  public totalPrice() {
    let totalPrice = 0
    for (let product of this.getProducts().controls) {
      totalPrice += product.get('totalPrice')?.getRawValue();
    }
    this.form.get('totalPrice')?.setValue(totalPrice);
  }


  public openModal(update: boolean = false, data: Discount | null = null) {
    if (update && data) {
      this.toUpdate = true;
      this.form.patchValue(data)
    }
    else {
      this.toUpdate = false;
      this.form.get('code')?.setValue(this.generatorService.generateKey('O'));
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
      await this.orderService.updateOrder(this.form.getRawValue());
      this.generalService.toast.set({ show: true, message: 'Order successfully updated', type: 'alert-success' });
    } catch (e) {
    }

  }

  public onCancel() {
    this.router.navigate([''])
  }
}
