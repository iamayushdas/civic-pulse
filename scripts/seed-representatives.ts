import { MongoClient, ObjectId } from 'mongodb';
import representativeData from '../delhi_mla_depthead.json';
import { ComplaintCategory } from '../src/types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'delhi-civic';

const DEPARTMENT_CATEGORY_MAP: Record<string, ComplaintCategory> = {
  Administration: 'ADMINISTRATION',
  'Water Supply & Sewage': 'WATER_SUPPLY_SEWAGE',
  'Pollution Control': 'POLLUTION_CONTROL',
  'Municipal / Civic Administration (sanitation, parks, public toilets)': 'MUNICIPAL_CIVIC',
};

function asOptionalString(value: string | null | undefined): string | undefined {
  return value ?? undefined;
}

async function seedRepresentatives() {
  const client = await MongoClient.connect(MONGODB_URI);

  try {
    const db = client.db(DATABASE_NAME);
    const mlas = db.collection('mlas');
    const departmentHeads = db.collection('department_heads');

    const mlaOperations = representativeData.mlas.map((mla) => ({
      replaceOne: {
        filter: { _id: new ObjectId(mla._id) },
        replacement: {
          ...mla,
          _id: new ObjectId(mla._id),
          phone: asOptionalString(mla.phone),
          email: asOptionalString(mla.email),
          photoUrl: asOptionalString(mla.photoUrl),
          termStart: new Date(mla.termStart),
          termEnd: new Date(mla.termEnd),
        },
        upsert: true,
      },
    }));

    const departmentOperations = representativeData.deptHeads.map((head) => ({
      replaceOne: {
        filter: { _id: new ObjectId(head._id) },
        replacement: {
          ...head,
          _id: new ObjectId(head._id),
          departmentCategory: DEPARTMENT_CATEGORY_MAP[head.departmentCategory],
          district: asOptionalString(head.district),
          city: asOptionalString(head.city),
          pincode: asOptionalString(head.pincode),
          ward: asOptionalString(head.ward),
          phone: asOptionalString(head.phone),
          email: asOptionalString(head.email),
          photoUrl: asOptionalString(head.photoUrl),
        },
        upsert: true,
      },
    }));

    await mlas.bulkWrite(mlaOperations);
    await departmentHeads.bulkWrite(departmentOperations);

    await mlas.createIndexes([
      { key: { state: 1, constituency: 1 }, unique: true },
      { key: { pincodes: 1 } },
      { key: { isActive: 1 } },
      { key: { party: 1 } },
    ]);
    await departmentHeads.createIndexes([
      { key: { state: 1, department: 1, district: 1, designation: 1 }, unique: true },
      { key: { pincode: 1 } },
      { key: { ward: 1 } },
      { key: { departmentCategory: 1 } },
      { key: { isActive: 1 } },
    ]);

    console.log(`Seeded ${representativeData.mlas.length} MLAs and ${representativeData.deptHeads.length} department heads.`);
  } finally {
    await client.close();
  }
}

seedRepresentatives().catch((error) => {
  console.error('Failed to seed representatives:', error);
  process.exitCode = 1;
});