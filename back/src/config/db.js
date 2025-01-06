import moongose from "mongoose";
import config from "./config.js"

export const connectMongoDB = (async () => {
  try {
    await moongose.connect(config.mongodb_uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log("DB CONNECTED")
  } catch (error) {
    console.error(error)
    console.error("ERROR AL CONECTAR BASE DE DATOS")
  }
})();