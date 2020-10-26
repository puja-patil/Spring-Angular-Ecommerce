import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { console.log("cart service constructor") }

  addToCart(theCartItem: CartItem) {
    //check if the item is already is present
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id == theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      alreadyExistInCart = (existingCartItem != undefined);
    }

    if (alreadyExistInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }
    //next() is used to publish.send events. this will publish events to subscribers
    this.totalPrice.next(totalPriceValue);//one event for totalPrice
    this.totalQuantity.next(totalQuantityValue);//one event for totalQuantity

    //logg
    this.logCartDate(totalPriceValue, totalQuantityValue);
  }
  logCartDate(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contents of the cart');
    for (let item of this.cartItems) {
      let subtotalPRice = item.unitPrice * item.quantity;
      console.log(`name:${item.name}, quantity:${item.quantity}, subtotal:${subtotalPRice}, unitPRice: ${item.unitPrice}`);
    }

    console.log(`totalPRice:${totalPriceValue.toFixed(2)}, totalQuantity : ${totalQuantityValue}`);
    console.log("--------")
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //get index of the item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    //if founf remove the otr=em form the array
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }


}
