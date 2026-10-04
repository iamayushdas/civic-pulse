import { ObjectId } from 'mongodb';
import { MLA } from '@/types';

export type MLAModel = Omit<MLA, '_id'> & {
  _id?: ObjectId;
};

export const MLACollection = 'mlas';

export const MLAIndexes = [
  { key: { state: 1, constituency: 1 }, unique: true },
  { key: { pincodes: 1 } },
  { key: { isActive: 1 } },
  { key: { party: 1 } },
];

export function toMLAResponse(mla: MLAModel): MLA {
  return {
    _id: mla._id?.toString(),
    name: mla.name,
    constituency: mla.constituency,
    constituencyId: mla.constituencyId,
    party: mla.party,
    state: mla.state,
    district: mla.district,
    phone: mla.phone,
    email: mla.email,
    address: mla.address,
    photoUrl: mla.photoUrl,
    termStart: mla.termStart,
    termEnd: mla.termEnd,
    isActive: mla.isActive,
    pincodes: mla.pincodes,
    assemblyConstituency: mla.assemblyConstituency,
    x: mla.x,
    instagram: mla.instagram,
  };
}