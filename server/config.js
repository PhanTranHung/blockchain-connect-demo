const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

module.exports = {
  PORT: process.env.PORT || 7777,
  NODE_ENV: process.env.NODE_ENV,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  RPC_URL: process.env.RPC_URL,
  PUBLIC_ADDRESS: process.env.PUBLIC_ADDRESS,
  PRIVATE_ADDRESS: process.env.PRIVATE_ADDRESS,
};
