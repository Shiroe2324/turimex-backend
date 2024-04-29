import connectMongoDB from '@mongodb/connection';
import connectRedisDB from '@redis/connection';

async function connectDatabases() {
  await connectMongoDB();
  await connectRedisDB();
}

export default connectDatabases;
