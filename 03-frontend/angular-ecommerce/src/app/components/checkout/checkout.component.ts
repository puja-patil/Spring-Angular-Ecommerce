import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Country } from 'src/app/common/country';
import { JsonpInterceptor } from '@angular/common/http';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder, private luv2shopFormServie: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log(startMonth);
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
    )



  }

  onSubmit() {
    console.log("Handling the event");
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
