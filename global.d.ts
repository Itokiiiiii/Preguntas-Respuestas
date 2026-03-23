import { MongoClient } from 'mongodb';

declare global {
    // Esto permite que 'var' sea reconocido en el ámbito global de NodeJS
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export { };