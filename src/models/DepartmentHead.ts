import { ObjectId } from 'mongodb';
import { DepartmentHead } from '@/types';

export type DepartmentHeadModel = Omit<DepartmentHead, '_id'> & {
  _id?: ObjectId;
};

export const DepartmentHeadCollection = 'department_heads';

export const DepartmentHeadIndexes = [
  { key: { state: 1, department: 1, district: 1, designation: 1 }, unique: true },
  { key: { pincode: 1 } },
  { key: { ward: 1 } },
  { key: { departmentCategory: 1 } },
  { key: { isActive: 1 } },
];

export function toDepartmentHeadResponse(deptHead: DepartmentHeadModel): DepartmentHead {
  return {
    _id: deptHead._id?.toString(),
    name: deptHead.name,
    designation: deptHead.designation,
    department: deptHead.department,
    departmentCategory: deptHead.departmentCategory,
    state: deptHead.state,
    district: deptHead.district,
    city: deptHead.city,
    pincode: deptHead.pincode,
    ward: deptHead.ward,
    phone: deptHead.phone,
    email: deptHead.email,
    officeAddress: deptHead.officeAddress,
    photoUrl: deptHead.photoUrl,
    isActive: deptHead.isActive,
    jurisdiction: deptHead.jurisdiction,
  };
}