import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(
        "mongodb+srv://goyalbhartendu:testing123@cluster0.1axajw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        opts
      )
      .then((mongoose) => {
        console.log("Db Connected!");
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
