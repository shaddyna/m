export const currentUser = {
    id: 1,
    name: "Alexandra Smith",
    email: "alexandra@example.com",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    joinedDate: "January 2023",
    shippingAddress: {
      street: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    billingAddress: {
      street: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
  };
  
  export const orders = [
    {
      id: "#ORD-78901",
      date: "2023-10-15",
      status: "Delivered",
      items: [
        {
          id: 1,
          name: "Silk Evening Gown",
          designer: "Valentino",
          price: 1299,
          image: "https://i.pinimg.com/736x/97/82/56/978256ac60bc5ed25e6dfeda175bd14d.jpg",
          quantity: 1,
        },
      ],
      total: 1299,
      trackingNumber: "UPS123456789",
    },
    // ... other orders
  ];
  

  export const users = [
    {
      id: 1,
      name: "Alexandra Smith",
      email: "alexandra@example.com",
      role: "admin",
      joined: "2023-01-15",
      orders: 12
    },
    {
      id: 2,
      name: "Michael Johnson",
      email: "michael@example.com",
      role: "customer",
      joined: "2023-02-20",
      orders: 5
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "customer",
      joined: "2023-03-10",
      orders: 8
    }
  ];
  
  // Dummy products data (for admin)
  export const products = [
    {
      id: 1,
      name: "Silk Evening Gown",
      designer: "Valentino",
      price: 1299,
      stock: 15,
      category: "Dresses"
    },
    {
      id: 2,
      name: "Leather Trench Coat",
      designer: "Balenciaga",
      price: 2499,
      stock: 8,
      category: "Outerwear"
    },
    {
      id: 3,
      name: "Cashmere Blazer",
      designer: "Saint Laurent",
      price: 899,
      stock: 12,
      category: "Suits"
    }
  ];