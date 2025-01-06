import { createSeedData } from "./seedDB.js";

createSeedData().then(() => process.exit(1))