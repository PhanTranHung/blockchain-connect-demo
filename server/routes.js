const express = require("express");
const CasioTokenAbi = require("../artifacts/contracts/CasinoToken.sol/CasinoToken.json");
const config = require("./config");
const { Web3 } = require("web3");
const path = require("path");

const web3 = new Web3(config.RPC_URL);
const Contract = new web3.eth.Contract(
  CasioTokenAbi.abi,
  config.CONTRACT_ADDRESS
);
// const account = web3.eth.accounts.privateKeyToAccount(config.PRIVATE_ADDRESS);

const callSmartContractRouter = express.Router();

callSmartContractRouter.post("/", async (req, resp) => {
  const { functionName, params, viewOnly } = req.body;

  if (viewOnly) {
    try {
      result = await Contract.methods[functionName](...params).call();
      resp.send(result);
    } catch (err) {
      console.error(err);
      resp.send("Error");
    }
  } else {
    try {
      const tx = Contract.methods[functionName](...params);
      const gas = await tx.estimateGas({
        from: config.PUBLIC_ADDRESS,
        data: tx.encodeABI(),
      });
      const signed = await web3.eth.accounts.signTransaction(
        {
          from: config.PUBLIC_ADDRESS,
          data: tx.encodeABI(),
          to: Contract.options.address,
          gas,
          gasPrice: await web3.eth.getGasPrice(),
        },
        config.PRIVATE_ADDRESS
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signed.rawTransaction
      );
      resp.send({ transactionHash: receipt.transactionHash });
    } catch (err) {
      console.error(err);
      resp.send("Error");
    }
  }
});

callSmartContractRouter.get("/abi", async (req, resp) => {
  resp.json(CasioTokenAbi.abi);
});

const uiRouter = express.Router();
uiRouter.get("/", async (req, resp) => {
  const filePath = path.join(__dirname, "./public/index.html");
  resp.sendFile(filePath);
});

const configureRoutes = (app) => {
  app.use("/smartcontract", callSmartContractRouter);
  app.use("/", uiRouter);
};

module.exports = configureRoutes;
