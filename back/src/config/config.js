import dotenv from "dotenv";
dotenv.config()

export default {
  api_port: process.env.API_PORT,
  mongodb_uri: process.env.MONGODB_URI,
  env: process.env.ENV,
};