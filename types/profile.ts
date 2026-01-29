// types/User.ts

export interface User {
  _id: string; // MongoDB ObjectId
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  lastLogin?: Date; // Optional field
  createdAt: Date;
  updatedAt: Date;
}