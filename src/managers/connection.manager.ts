import connectMongoDB from '../databases/mongodb/connection';

async function connectDatabases() {
  await connectMongoDB();
}

export default connectDatabases;
