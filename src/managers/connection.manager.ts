import connectMongoDB from '../databases/mongodb/connection';
import connectRedisDB from '../databases/redis/connection';

async function connectDatabases() {
  await connectMongoDB();
  await connectRedisDB();
}

export default connectDatabases;
