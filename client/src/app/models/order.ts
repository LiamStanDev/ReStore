export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  buyerId: string;
  shippingAddress: ShippingAddress;
  orderDay: string;
  orderItems: OrderItem[];
  subTotal: number;
  deliveryFee: number;
  orderStatus: string;
  total: number;
}
