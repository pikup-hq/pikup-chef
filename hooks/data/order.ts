export type OrderStatus =
  | "about_to_prepare"
  | "in_preparation"
  | "done"
  | "on_the_way";

export interface OrderItem {
  product: any;
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  customerName: string;
  customerImage: string;
  deliveryType: "instant" | "scheduled";
  location: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: string;
  totalAmount: number;
  rider: {
    name: string;
    phone: string;
    company: string;
  };
  isAccepted?: boolean;
  createdAt: string;
}
