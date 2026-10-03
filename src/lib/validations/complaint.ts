import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
});

export const createComplaintSchema = z.object({
  category: z.enum([
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
  ]),
  subCategory: z.string().optional(),
  title: z.string().min(10).max(200),
  description: z.string().min(20).max(2000),
  images: z.array(z.string()).max(5),
  location: locationSchema,
  area: z.string().min(2).max(100),
  ward: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  anonymous: z.boolean(),
  citizenName: z.string().min(2).max(100).optional(),
  citizenPhone: z.string().regex(/^\d{10}$/).optional(),
  citizenEmail: z.string().email().optional(),
});

export const updateComplaintStatusSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'VERIFIED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'REOPENED',
    'REJECTED',
    'DUPLICATE',
  ]),
  note: z.string().min(5).max(1000).optional(),
  images: z.array(z.string()).max(5).optional(),
  assignedTo: z.string().optional(),
  department: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  resolutionNote: z.string().max(1000).optional(),
  resolutionImages: z.array(z.string()).max(5).optional(),
});

export const complaintQuerySchema = z.object({
  category: z.string().optional(),
  status: z.string().optional(),
  area: z.string().optional(),
  ward: z.string().optional(),
  pincode: z.string().optional(),
  department: z.string().optional(),
  priority: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
