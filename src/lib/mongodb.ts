import { MongoClient } from "mongodb";

const DEFAULT_MONGODB_URI = "mongodb+srv://nis174731_db_user:sRucG04SfejdTYHD@cluster0.wtv2khg.mongodb.net/judomanager?retryWrites=true&w=majority&appName=Cluster0";

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;
