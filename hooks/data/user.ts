export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  recipient: string;
  date: string;
  status: "successful" | "pending" | "failed";
}

export interface User {
  businessName: string;
  email: string;
  logo: string;
  wallet: {
    balance: number;
    transactions: Transaction[];
  };
}

// Updated dummy user data
export const userData: User = {
  businessName: "FFC School Branch",
  email: "ffc@gmail.com",
  logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  wallet: {
    balance: 70000,
    transactions: [
      {
        id: "1",
        type: "credit",
        amount: 3000,
        description: "Transfer to",
        recipient: "Akintunde",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "2",
        type: "credit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "pending",
      },
      {
        id: "3",
        type: "debit",
        amount: 3000,
        description: "Transfer to",
        recipient: "John",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "4",
        type: "credit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "5",
        type: "debit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "6",
        type: "credit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "7",
        type: "debit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "8",
        type: "credit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "9",
        type: "debit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "10",
        type: "credit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      {
        id: "11",
        type: "debit",
        amount: 3000,
        description: "Transfer to",
        recipient: "ALESINLOYE TINUADE",
        date: "Oct 8th, 21:24:14",
        status: "successful",
      },
      // Add more transactions as needed...
    ],
  },
};
