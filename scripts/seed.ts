import { MongoClient } from 'mongodb';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../src/types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const AREAS = [
  'Connaught Place',
  'Saket',
  'Dwarka',
  'Rohini',
  'Vasant Vihar',
  'Karol Bagh',
  'Lajpat Nagar',
  'Chandni Chowk',
  'Hauz Khas',
  'Pitampura',
  'Janakpuri',
  'Mayur Vihar',
];

const CATEGORIES: ComplaintCategory[] = [
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

const STATUSES: ComplaintStatus[] = [
  'SUBMITTED',
  'VERIFIED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
];

const COMPLAINTS_DATA = [
  {
    category: 'WATER_SUPPLY',
    title: 'Water pipeline burst on main road',
    description: 'A major water pipeline has burst near the market area, causing flooding on the road. Water is being wasted continuously and the road has become difficult to use. Urgent repair needed.',
    area: 'Connaught Place',
  },
  {
    category: 'ROADS',
    title: 'Large pothole causing accidents',
    description: 'There is a very large and deep pothole on the main road that has caused multiple vehicle accidents in the past week. The pothole is approximately 3 feet wide and 1 foot deep.',
    area: 'Saket',
  },
  {
    category: 'GARBAGE',
    title: 'Garbage not collected for 5 days',
    description: 'Municipal garbage collection has not happened in our locality for the past 5 days. The garbage is piling up and creating hygiene issues. Stray animals are spreading the waste.',
    area: 'Dwarka',
  },
  {
    category: 'DRAINAGE',
    title: 'Blocked drainage causing waterlogging',
    description: 'The drainage system in our area is completely blocked. During rain, water accumulates for hours. The blocked drain also emits foul smell.',
    area: 'Rohini',
  },
  {
    category: 'STREETLIGHTS',
    title: 'Street lights not working for 2 weeks',
    description: 'All street lights in our residential area have been non-functional for the past 2 weeks. This is creating safety concerns, especially for women and elderly residents.',
    area: 'Vasant Vihar',
  },
  {
    category: 'PARKS',
    title: 'Park equipment broken and dangerous',
    description: 'The children\'s play equipment in the community park is broken and has sharp edges. Multiple children have been injured. The swings are also damaged.',
    area: 'Karol Bagh',
  },
  {
    category: 'POLLUTION',
    title: 'Construction dust causing health issues',
    description: 'Nearby construction site is generating excessive dust that is affecting air quality in the neighborhood. No water spraying or dust control measures are being taken.',
    area: 'Lajpat Nagar',
  },
  {
    category: 'ILLEGAL_DUMPING',
    title: 'Industrial waste dumped in empty plot',
    description: 'Someone has been illegally dumping industrial waste in the empty plot next to our colony. The waste includes chemicals and is a serious environmental hazard.',
    area: 'Chandni Chowk',
  },
  {
    category: 'SEWERAGE',
    title: 'Sewage overflow on residential street',
    description: 'Raw sewage is overflowing from the manhole on our street for the past 3 days. The smell is unbearable and it is creating serious health hazards.',
    area: 'Hauz Khas',
  },
  {
    category: 'PUBLIC_TOILETS',
    title: 'Public toilet not maintained',
    description: 'The public toilet near the market has not been cleaned for many days. It is in extremely poor condition and people are avoiding it, leading to open defecation nearby.',
    area: 'Pitampura',
  },
  {
    category: 'STRAY_ANIMALS',
    title: 'Pack of stray dogs creating danger',
    description: 'A large pack of stray dogs has been aggressive towards people, especially children and elderly. Multiple people have been chased. Animal control needs to intervene.',
    area: 'Janakpuri',
  },
  {
    category: 'ROADS',
    title: 'Road cave-in after recent rains',
    description: 'A section of the road has caved in after the recent heavy rains, creating a dangerous crater. Vehicles need to take dangerous detours.',
    area: 'Mayur Vihar',
  },
  {
    category: 'WATER_SUPPLY',
    title: 'No water supply for 48 hours',
    description: 'Our entire sector has had no water supply for the past 48 hours. No information has been provided about when supply will resume. Residents are struggling.',
    area: 'Dwarka',
  },
  {
    category: 'GARBAGE',
    title: 'Overflowing community bin attracting rats',
    description: 'The community garbage bin has been overflowing for days. It is attracting rats and creating unsanitary conditions. The bin needs to be emptied urgently.',
    area: 'Saket',
  },
  {
    category: 'STREETLIGHTS',
    title: 'Dark alley needs street lighting',
    description: 'The alley connecting two main roads has no street lighting at all. This creates a major safety issue at night. Multiple theft incidents have occurred.',
    area: 'Connaught Place',
  },
];

function generateComplaintId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DL-${timestamp}${random}`;
}

function getRandomLocation(area: string) {
  // Delhi approximate center: 28.6139, 77.2090
  const baseLat = 28.6139;
  const baseLng = 77.2090;
  
  // Random offset within ~10km radius
  const latOffset = (Math.random() - 0.5) * 0.2;
  const lngOffset = (Math.random() - 0.5) * 0.2;
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
    address: area,
  };
}

function getRandomDate(daysAgo: number) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
  return date;
}

async function seedDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  
  try {
    const db = client.db('delhi-civic');
    const complaintsCollection = db.collection('complaints');

    // Clear existing data
    await complaintsCollection.deleteMany({});
    console.log('Cleared existing complaints');

    const complaints: Complaint[] = [];

    // Generate sample complaints
    for (let i = 0; i < COMPLAINTS_DATA.length; i++) {
      const data = COMPLAINTS_DATA[i];
      const createdAt = getRandomDate(30);
      const statusIndex = Math.floor(Math.random() * 5);
      const status = STATUSES[statusIndex];
      
      const statusHistory = [];
      let currentDate = createdAt;
      
      for (let j = 0; j <= statusIndex; j++) {
        statusHistory.push({
          status: STATUSES[j],
          timestamp: currentDate,
          note: j === 0 ? 'Complaint submitted' : `Updated to ${STATUSES[j].replace('_', ' ')}`,
        });
        currentDate = new Date(currentDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
      }

      const complaint: Complaint = {
        complaintId: generateComplaintId(),
        category: data.category as ComplaintCategory,
        title: data.title,
        description: data.description,
        images: [],
        location: getRandomLocation(data.area),
        area: data.area,
        ward: `Ward ${Math.floor(Math.random() * 270) + 1}`,
        pincode: `11${Math.floor(Math.random() * 100).toString().padStart(4, '0')}`,
        status,
        priority: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'][Math.floor(Math.random() * 4)] as any,
        createdAt,
        updatedAt: currentDate,
        anonymous: Math.random() > 0.7,
        citizenName: Math.random() > 0.7 ? undefined : `Citizen ${i + 1}`,
        citizenPhone: Math.random() > 0.7 ? undefined : `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        citizenEmail: Math.random() > 0.7 ? undefined : `citizen${i + 1}@example.com`,
        department: status !== 'SUBMITTED' ? ['Water Department', 'PWD', 'MCD', 'DJB'][Math.floor(Math.random() * 4)] : undefined,
        statusHistory,
        viewCount: Math.floor(Math.random() * 500),
        resolutionNote: status === 'RESOLVED' ? 'Issue has been resolved and verified by field team.' : undefined,
      };

      complaints.push(complaint);
    }

    // Insert complaints
    await complaintsCollection.insertMany(complaints as any);
    console.log(`✅ Seeded ${complaints.length} complaints`);

    // Create indexes
    await complaintsCollection.createIndex({ complaintId: 1 }, { unique: true });
    await complaintsCollection.createIndex({ category: 1 });
    await complaintsCollection.createIndex({ status: 1 });
    await complaintsCollection.createIndex({ area: 1 });
    await complaintsCollection.createIndex({ createdAt: -1 });
    console.log('✅ Created indexes');

    console.log('\n📊 Database seeding completed successfully!');
    console.log(`Total complaints: ${complaints.length}`);
    console.log('\nSample complaint IDs:');
    complaints.slice(0, 5).forEach((c) => {
      console.log(`  ${c.complaintId} - ${c.category} - ${c.area}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
