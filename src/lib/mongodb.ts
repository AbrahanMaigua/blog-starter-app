import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  connectTimeoutMS: 10000,
  appName: "MongoDB Atlas",
}


if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env');
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri as string, options);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri as string ,  options);
  clientPromise = client.connect();
}

export default clientPromise;
