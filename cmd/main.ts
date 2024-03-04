// Dependencies
import * as yargs from "yargs";
import dotenv from "dotenv";
import { join } from "path";
import Web3, { AbiFunctionFragment, Contract } from "web3";
import { RegisteredSubscription } from "web3/lib/commonjs/eth.exports";
import fs from "fs";
import promptsync from "prompt-sync";

// Define interface for arguments
interface Arguments {
  rpcUrl: string;
  abiFile: string;
  contract: string;
  publicKey: string;
  privateKey: string;
  functionName: string;
  parameter: string[];
}

dotenv.config({ path: ".env" });
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const isViewOnlyFunction = (
  functionName: string,
  abi: AbiFunctionFragment[]
) => {
  const f = abi.find((f) => f.name === functionName && f.type === "function");
  if (!f) throw new Error(`Function ${functionName} doesn't exists.`);

  return f.stateMutability === "view";
};

const readAbiFile = (filePath: string): AbiFunctionFragment[] => {
  const fPath = join(process.cwd(), filePath);
  const fileContent = fs.readFileSync(fPath);
  return JSON.parse(fileContent.toString());
};

const callViewOnlyFunction = async (
  functionName: string,
  params: any[],
  contract: Contract<AbiFunctionFragment[]>
) => {
  const result = await contract.methods[functionName](...params).call();
  if (params.length === 0) {
    console.log(`Call function "${functionName}" with no param`);
  } else {
    console.log(`Call function "${functionName}" with params:`, ...params);
  }
  console.log(`The value is:`, result);
};

const executeFunctionWithTransaction = async (
  functionName: string,
  params: any[],
  contract: Contract<AbiFunctionFragment[]>,
  publicKey: string,
  privateKey: string,
  web3: Web3<RegisteredSubscription>
) => {
  if (!publicKey || !privateKey) {
    throw new Error(
      "Public key and private key is required to execute this function"
    );
  }

  if (params.length === 0) {
    console.log(`Call function "${functionName}" with no param`);
  } else {
    console.log(`Call function "${functionName}" with params:`, ...params);
  }

  const prompt = promptsync();
  const aws = prompt(
    "WARNING: Executing this function will create a transaction, it may consume some of your native tokens.\nDo you want to continue? (y/N)"
  );
  if (aws.toLowerCase() !== "y") {
    return console.log("Command cancelled!");
  }

  const tx = contract.methods[functionName](...params);
  const gas = await tx.estimateGas({
    from: publicKey,
    data: tx.encodeABI(),
  });
  const signed = await web3.eth.accounts.signTransaction(
    {
      from: publicKey,
      data: tx.encodeABI(),
      to: contract.options.address,
      gas,
      gasPrice: await web3.eth.getGasPrice(),
    },
    privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log(`Execute function ${functionName} with params:`, ...params);
  console.log(`The transaction hash is:`, receipt.transactionHash);
};

// Function to get environment variable or default value
function getEnvVar(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

// Function to build arguments object
function buildArguments(): Arguments {
  const argv = yargs
    .command("Call", "Call a function on a contract")
    .option("u", {
      alias: "rpc-url",
      describe: "RPC URL of the Ethereum node",
      default: getEnvVar("RPC_URL", ""),
      type: "string",
      demandOption: true,
    })
    .option("a", {
      alias: "abi-file",
      describe: "Path to the ABI file of the contract",
      default: getEnvVar("ABI_PATH", ""),
      type: "string",
      demandOption: true,
    })
    .option("c", {
      alias: "contract",
      describe: "Address of the Ethereum contract",
      default: getEnvVar("CONTRACT_ADDRESS", ""),
      type: "string",
      demandOption: true,
    })
    .option("k", {
      alias: "public-key",
      describe: "Public key of the Ethereum account",
      default: getEnvVar("PUBLIC_ADDRESS", ""),
      type: "string",
      demandOption: true,
    })
    .option("p", {
      alias: "private-key",
      describe: "Private key of the Ethereum account",
      default: getEnvVar("PRIVATE_ADDRESS", ""),
      type: "string",
      demandOption: true,
    })
    .option("f", {
      alias: "function-name",
      describe: "Name of the function to call",
      type: "string",
      demandOption: true,
    })
    .option("r", {
      alias: "parameter",
      describe: "Function parameter (can be used multiple times)",
      type: "string",
      array: true,
      default: [],
      demandOption: true,
    })
    .help().argv as unknown as Arguments;

  return argv;
}
// Function to execute the program
async function main() {
  const args = buildArguments();

  //   console.log(args);

  const {
    rpcUrl,
    abiFile,
    contract,
    publicKey,
    privateKey,
    functionName,
    parameter,
  } = args;

  const abi = readAbiFile(abiFile);
  const web3 = new Web3(rpcUrl);
  const Contract = new web3.eth.Contract(abi, contract);

  try {
    if (isViewOnlyFunction(functionName, abi)) {
      await callViewOnlyFunction(functionName, parameter, Contract);
    } else {
      await executeFunctionWithTransaction(
        functionName,
        parameter,
        Contract,
        publicKey,
        privateKey,
        web3
      );
    }
  } catch (err) {
    console.log("Error:");
    console.error(err);
  }
}

// Run the program
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
