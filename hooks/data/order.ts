export type OrderStatus =
  | "about_to_prepare"
  | "in_preparation"
  | "done"
  | "on_the_way";

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
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
}

// Updated dummy orders data
export const ordersData: Order[] = [
  {
    id: "1",
    customerName: "Akinfenwa Tinuade",
    customerImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    deliveryType: "instant",
    location: "Soul win hall, opposite BUB building, around motion ground",
    items: [
      {
        id: "1",
        name: "Rice",
        description: "Smoky jollof",
        price: 2000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      {
        id: "2",
        name: "Chicken",
        description: "Chicken",
        price: 1000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
    ],
    status: "about_to_prepare",
    timestamp: "02:30pm",
    totalAmount: 16000,
    rider: {
      name: "Easy Logistics",
      phone: "+234 906 5348 317",
      company: "Easy Logistics",
    },
  },
  {
    id: "2",
    customerName: "Akinfenwa Tinuade",
    customerImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    deliveryType: "instant",
    location: "Soul win hall, opposite BUB building, around motion ground",
    items: [
      {
        id: "1",
        name: "Rice",
        description: "Smoky jollof",
        price: 2000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      {
        id: "2",
        name: "Chicken",
        description: "Chicken",
        price: 1000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
    ],
    status: "done",
    timestamp: "02:30pm",
    totalAmount: 16000,
    rider: {
      name: "Easy Logistics",
      phone: "+234 906 5348 317",
      company: "Easy Logistics",
    },
  },
  {
    id: "3",
    customerName: "Akinfenwa Tinuade",
    customerImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    deliveryType: "instant",
    location: "Soul win hall, opposite BUB building, around motion ground",
    items: [
      {
        id: "1",
        name: "Rice",
        description: "Smoky jollof",
        price: 2000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
      {
        id: "2",
        name: "Chicken",
        description: "Chicken",
        price: 1000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      },
    ],
    status: "about_to_prepare",
    timestamp: "02:30pm",
    totalAmount: 16000,
    rider: {
      name: "Easy Logistics",
      phone: "+234 906 5348 317",
      company: "Easy Logistics",
    },
  },
  // ... add more orders with similar structure
];
