import { MongoClient } from 'mongodb';

const validRoles = new Set(['CITIZEN', 'OFFICER', 'SUPERADMIN']);
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const targetEmail = process.argv[2]?.trim();
const role = (process.argv[3]?.trim() || 'OFFICER').toUpperCase();

async function main() {
  if (!targetEmail) {
    console.error('Usage: npm run admin:grant -- <email> [OFFICER|SUPERADMIN]');
    process.exit(1);
  }

  if (!validRoles.has(role)) {
    console.error(`Invalid role: ${role}. Allowed roles: ${Array.from(validRoles).join(', ')}`);
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('delhi-civic');
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: targetEmail });
    if (!existingUser) {
      console.error(`No user found with email: ${targetEmail}`);
      process.exit(1);
    }

    const result = await users.updateOne(
      { email: targetEmail },
      { $set: { role, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      console.error(`Failed to update role for: ${targetEmail}`);
      process.exit(1);
    }

    console.log(`✅ Updated ${targetEmail} to role ${role}`);
  } catch (error) {
    console.error('Failed to update admin role:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
