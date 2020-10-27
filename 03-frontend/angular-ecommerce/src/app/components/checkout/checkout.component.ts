import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Country } from 'src/app/common/country';
import { JsonpInterceptor } from '@angular/common/http';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder, private luv2shopFormServie: Luv2ShopFormService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.pattern('[0-9]{16}'), Validators.required]),
        securityCode: new FormControl('', [Validators.pattern('[0-9]{3}'), Validators.required]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });


    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    //console.log(startMonth);
    this.luv2shopFormServie.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retreived credit card months:" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate credit card years 
    this.luv2shopFormServie.getCreditCardYears().subscribe(
      data => {
        console.log("Retreived credit card years:" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.luv2shopFormServie.getCountries().subscribe(
      data => {
        // console.log("countries:" + JSON.stringify(data));
        this.countries = data;
      }
    );


    //subscribe to cart total price
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data
      }
    );

    //subscribe to cart total quantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data
      }
    )

    //compute cart total price and quantity
    this.cartService.computeCartTotals();



  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipcode'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipcode'); }
  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  onSubmit() {

    console.log("Handling the event");
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("email is " + this.checkoutFormGroup.get('customer').value.email);
    console.log("shipping country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("shipping state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
    console.log("billing country is " + this.checkoutFormGroup.get('billingAddress').value.country.name);

  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.get('shippingAddress').value);
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    //if the current year equal selected year
    //start with current month
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.luv2shopFormServie.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("dependent start mnth " + startMonth);
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country code:${countryCode}`);
    console.log(`${formGroupName} country name:${countryName}`);
    this.luv2shopFormServie.getStates(countryCode).subscribe(
      data => {
        // console.log("retrieved state: " + JSON.stringify(data));
        if (formGroupName === "shippingAddress") {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }
        //select first state as default
        formGroup.get('state').setValue(data[0]);
      }
    );

  }



}
