import { MongoClient } from "mongodb";
import { env } from "*/config/environment";

export const connectDB = async () => {
  const client = new MongoClient(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");

    // List databases
    await listDatabases(client);

  } finally {
    // Ensures that the client will close when finish/error
    await client.close();
  }
};

const listDatabases = async (client) => {
  const databasesList = await client.db().admin().listDatabases();
  console.log(databasesList);
  console.log("Your databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
};
