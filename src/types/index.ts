export type ComplaintStatus =
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REOPENED'
  | 'REJECTED'
  | 'DUPLICATE';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintCategory =
  | 'WATER_SUPPLY'
  | 'ADMINISTRATION'
  | 'WATER_SUPPLY_SEWAGE'
  | 'POLLUTION_CONTROL'
  | 'MUNICIPAL_CIVIC'
  | 'ROADS'
  | 'GARBAGE'
  | 'DRAINAGE'
  | 'SEWERAGE'
  | 'STREETLIGHTS'
  | 'PARKS'
  | 'POLLUTION'
  | 'ILLEGAL_DUMPING'
  | 'PUBLIC_TOILETS'
  | 'STRAY_ANIMALS'
  | 'OTHER';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface StatusHistoryEntry {
  status: ComplaintStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
  isPublic?: boolean;
}

export interface ComplaintComment {
  _id?: string;
  complaintId: string;
  authorName: string;
  authorEmail?: string;
  body: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface Complaint {
  _id?: string;
  complaintId: string;
  category: ComplaintCategory;
  subCategory?: string;
  title: string;
  description: string;
  images: string[];
  location: Location;
  area: string;
  ward?: string;
  pincode?: string;
  department?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: Date;
  updatedAt: Date;
  citizenId?: string;
  citizenName?: string;
  citizenPhone?: string;
  citizenEmail?: string;
  anonymous: boolean;
  assignedTo?: string;
  resolutionNote?: string;
  resolutionImages?: string[];
  slaDueAt?: Date;
  duplicateOf?: string;
  confirmationCount?: number;
  confirmationKeys?: string[];
  statusHistory: StatusHistoryEntry[];
  viewCount: number;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'citizen' | 'admin' | 'department';
  department?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Department {
  _id?: string;
  name: string;
  code: string;
  categories: ComplaintCategory[];
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
}

export interface Area {
  _id?: string;
  name: string;
  ward?: string;
  pincode: string;
  district: string;
  complaintCount: number;
}

export interface MLA {
  _id?: string;
  name: string;
  constituency: string;
  constituencyId?: string;
  party: string;
  state: string;
  district?: string;
  phone?: string;
  email?: string;
  address?: string;
  photoUrl?: string;
  termStart?: Date;
  termEnd?: Date;
  isActive: boolean;
  pincodes?: string[];
  assemblyConstituency?: string;
  x?: {
    handle?: string;
    url?: string;
    status?: string;
    alternate_handles?: string[];
  };
  instagram?: {
    handle?: string;
    url?: string;
    status?: string;
    alternate_handles?: string[];
    note?: string;
  };
}

export interface DepartmentHead {
  _id?: string;
  name: string;
  designation: string;
  department: string;
  departmentCategory: ComplaintCategory;
  state: string;
  district?: string;
  city?: string;
  pincode?: string;
  ward?: string;
  phone?: string;
  email?: string;
  officeAddress?: string;
  photoUrl?: string;
  isActive: boolean;
  jurisdiction?: string;
  x?: {
    handle?: string;
    url?: string;
    status?: string;
    alternate_handles?: string[];
  };
  instagram?: {
    handle?: string;
    url?: string;
    status?: string;
    alternate_handles?: string[];
    note?: string;
  };
}

export interface Representative {
  type: 'MLA' | 'DEPARTMENT_HEAD' | 'WARD_OFFICER' | 'MP' | 'MAYOR' | 'COUNCILLOR';
  name: string;
  designation: string;
  department?: string;
  party?: string;
  phone?: string;
  email?: string;
  address?: string;
  photoUrl?: string;
  jurisdiction?: string;
  pincode?: string;
  area?: string;
  ward?: string;
  x?: {
    handle?: string;
    url?: string;
    status?: string;
    alternate_handles?: string[];
  };
  instagram?: {
    handle?: string;
    url?: string;
    status?: string;
    alternate_handles?: string[];
    note?: string;
  };
}

export interface ComplaintUpdate {
  _id?: string;
  complaintId: string;
  status: ComplaintStatus;
  note: string;
  images?: string[];
  updatedBy: string;
  updatedByName: string;
  timestamp: Date;
  isPublic: boolean;
}

export interface Stats {
  total: number;
  open: number;
  resolved: number;
  thisWeek: number;
  byCategory: Record<ComplaintCategory, number>;
  byStatus: Record<ComplaintStatus, number>;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  WATER_SUPPLY: 'Water Supply',
  ADMINISTRATION: 'Administration',
  WATER_SUPPLY_SEWAGE: 'Water Supply & Sewage',
  POLLUTION_CONTROL: 'Pollution Control',
  MUNICIPAL_CIVIC: 'Municipal / Civic',
  ROADS: 'Roads',
  GARBAGE: 'Garbage',
  DRAINAGE: 'Drainage',
  SEWERAGE: 'Sewerage',
  STREETLIGHTS: 'Streetlights',
  PARKS: 'Parks',
  POLLUTION: 'Pollution',
  ILLEGAL_DUMPING: 'Illegal Dumping',
  PUBLIC_TOILETS: 'Public Toilets',
  STRAY_ANIMALS: 'Stray Animals',
  OTHER: 'Other',
};

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  'WATER_SUPPLY',
  'ROADS',
  'GARBAGE',
  'DRAINAGE',
  'SEWERAGE',
  'STREETLIGHTS',
  'PARKS',
  'POLLUTION',
  'ILLEGAL_DUMPING',
  'PUBLIC_TOILETS',
  'STRAY_ANIMALS',
  'OTHER',
];

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  SUBMITTED: 'Submitted',
  VERIFIED: 'Verified',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REOPENED: 'Reopened',
  REJECTED: 'Rejected',
  DUPLICATE: 'Duplicate',
};

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};
