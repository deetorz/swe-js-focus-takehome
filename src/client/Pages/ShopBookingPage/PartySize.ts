import { MenuItem, Shop } from "../../../types";

export class PartySize {
  readonly shop: Shop;

  readonly menu: MenuItem[];

  constructor(shop: Shop, menu: MenuItem[]) {
    this.shop = shop;
    this.menu = menu;
  }
}
