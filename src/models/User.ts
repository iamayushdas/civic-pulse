import { ObjectId } from 'mongodb';

export type UserRole = 'CITIZEN' | 'OFFICER' | 'SUPERADMIN';

export interface User {
  _id?: ObjectId;
  userId: string;
  name: string;
  email: string;
  password: string; // hashed
  phone?: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
}

// Helper to convert User to UserResponse (exclude password)
export function toUserResponse(user: User): UserResponse {
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
  };
}
