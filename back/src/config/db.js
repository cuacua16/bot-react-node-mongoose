import moongose from "mongoose";
import config from "./config.js"

export const connectMongoDB = (async () => {
  try {
    await moongose.connect(config.mongodb_uri)
    console.log("DB CONNECTED")
  } catch (error) {
    console.error("ERROR MONGODB connect", error)
  }
})();