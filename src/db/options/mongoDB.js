import { MongoClient } from "mongodb";
const uri = 'mongodb+srv://root:toor@cluster0.zntdz.mongodb.net/test';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

await client.connect();

const messagesCollection = client.db("challenge-auth").collection("messages");

export { messagesCollection };