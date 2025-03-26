export type OrderStatus =
  | "in_the_kitchen"
  | "prepared"
  | "on_the_way"
  | "completed"
  | "rejected";

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
  orderId: string | number | (string | number)[] | null | undefined;
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
