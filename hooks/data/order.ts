// Order data type
export interface Order {
  id: string;
  foodName: string;
  description: string;
  price: number;
  image: string;
  timestamp: string;
  status: 'ongoing' | 'completed';
  customerName: string;
  deliveryAddress: string;
}

// Dummy orders data
export const ordersData: Order[] = [
  {
    id: '1',
    foodName: 'Smoky jollof rice',
    description: 'Smoky jollof rice',
    price: 7000.00,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timestamp: '02:30pm',
    status: 'ongoing',
    customerName: 'John Doe',
    deliveryAddress: 'Block 5, Room 203, Campus Hostel'
  },
  {
    id: '2',
    foodName: 'Smoky jollof rice',
    description: 'Smoky jollof rice',
    price: 7000.00,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timestamp: '02:25pm',
    status: 'ongoing',
    customerName: 'Sarah Johnson',
    deliveryAddress: 'Block 3, Room 105, Campus Hostel'
  },
  {
    id: '3',
    foodName: 'Smoky jollof rice',
    description: 'Smoky jollof rice',
    price: 7000.00,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timestamp: '02:20pm',
    status: 'ongoing',
    customerName: 'Michael Brown',
    deliveryAddress: 'Block 7, Room 310, Campus Hostel'
  },
  {
    id: '4',
    foodName: 'Fried rice with chicken',
    description: 'Fried rice with grilled chicken',
    price: 8500.00,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timestamp: '01:45pm',
    status: 'completed',
    customerName: 'Emma Wilson',
    deliveryAddress: 'Block 2, Room 115, Campus Hostel'
  },
  {
    id: '5',
    foodName: 'Egusi soup with pounded yam',
    description: 'Traditional egusi soup with pounded yam',
    price: 9000.00,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timestamp: '12:30pm',
    status: 'completed',
    customerName: 'David Miller',
    deliveryAddress: 'Block 4, Room 220, Campus Hostel'
  },
  {
    id: '6',
    foodName: 'Pepper soup with catfish',
    description: 'Spicy pepper soup with fresh catfish',
    price: 10000.00,
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    timestamp: '11:15am',
    status: 'completed',
    customerName: 'Olivia Taylor',
    deliveryAddress: 'Block 1, Room 101, Campus Hostel'
  },
];