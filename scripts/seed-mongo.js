const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://nis174731_db_user:sRucG04SfejdTYHD@cluster0.wtv2khg.mongodb.net/judomanager?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    const db = client.db('judomanager');

    const res = await db.collection('license_requests').insertOne({
      id: 'REQ-1001',
      clubName: 'نادي أبطال الجودو (مثال)',
      managerName: 'الأستاذ أحمد',
      phone: '0553823611',
      email: 'judo.heroes@gmail.com',
      requestType: 'LIFETIME_PRO',
      status: 'APPROVED',
      generatedKey: 'JUDO-PRO-2026-OK01',
      createdAt: new Date().toISOString()
    });

    console.log('✅ Successfully connected & created judomanager database in Atlas! Document ID:', res.insertedId);
  } catch (err) {
    console.error('❌ Connection error:', err);
  } finally {
    await client.close();
  }
}

run();
