import app from "./app.js";
import { connectMongoDB } from "./config/db.js";

app.listen(process.env.API_PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${process.env.API_PORT}`)
})