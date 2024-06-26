import { http, encodeFunctionData } from "@flashbots/suave-viem";
import {
  getSuaveWallet,
  SuaveTxRequestTypes,
  TransactionRequestSuave,
} from "@flashbots/suave-viem/chains/utils";
import { readFileSync } from "fs";
import path from "path";

const SUAVE_RPC_URL = "https://rpc.rigil.suave.flashbots.net";
// Change this to a private key with rETH you get from https://faucet.rigil.suave.flashbots.net/
const PRIVATE_KEY =
  (`0x${process.env.PRIVATE_KEY}` as `0x${string}`) || undefined;
// Change this to the address of the deployed contract
const CONTRACT_ADDRESS = "0x28dB243FBffF37748Da01729d57Eb55D6fcb2F56";

const wallet = getSuaveWallet({
  transport: http(SUAVE_RPC_URL),
  privateKey: PRIVATE_KEY,
});

const json = JSON.parse(
  readFileSync(
    path.resolve(__dirname, "../../../out/offchain-logs.sol/OffchainLogs.json")
  ).toString()
);
const abi = json.abi;

const data = encodeFunctionData({
  abi,
  functionName: "example",
  args: [],
});

const ccr: TransactionRequestSuave = {
  confidentialInputs:
    "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000fd7b22626c6f636b4e756d626572223a22307830222c22747873223a5b2230786638363538303064383235323038393461646263653931303332643333396338336463653834316336346566643261393232383165653664383230336538383038343032303131386164613038376337386234353663653762343234386237313565353164326465656236343031363032343832333735663130663037396663666637373934383830653731613035373366336364343133396437323037643165316235623263323365353438623061316361636533373034343739656334653939316362356130623661323930225d2c2270657263656e74223a31307d000000",
  kettleAddress: "0x03493869959C866713C33669cA118E774A30A0E5",
  to: CONTRACT_ADDRESS,
  gasPrice: 10000000000n,
  gas: 420000n,
  type: SuaveTxRequestTypes.ConfidentialRequest,
  chainId: 16813125,
  data,
};

const res = await wallet.sendTransaction(ccr);

console.log(`example() exec tx hash: ${res}`);
console.log(`https://explorer.rigil.suave.flashbots.net/tx/${res}`);

const dataNoLogs = encodeFunctionData({
  abi,
  functionName: "exampleNoLogs",
  args: [],
});

const ccrNoLogs: TransactionRequestSuave = {
  confidentialInputs:
    "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000fd7b22626c6f636b4e756d626572223a22307830222c22747873223a5b2230786638363538303064383235323038393461646263653931303332643333396338336463653834316336346566643261393232383165653664383230336538383038343032303131386164613038376337386234353663653762343234386237313565353164326465656236343031363032343832333735663130663037396663666637373934383830653731613035373366336364343133396437323037643165316235623263323365353438623061316361636533373034343739656334653939316362356130623661323930225d2c2270657263656e74223a31307d000000",
  kettleAddress: "0x03493869959C866713C33669cA118E774A30A0E5",
  to: CONTRACT_ADDRESS,
  gasPrice: 10000000000n,
  gas: 420000n,
  type: SuaveTxRequestTypes.ConfidentialRequest,
  chainId: 16813125,
  data: dataNoLogs,
};

const resNoLogs = await wallet.sendTransaction(ccrNoLogs);

console.log(`exampleNoLogs() exec tx hash: ${resNoLogs}`);
console.log(`https://explorer.rigil.suave.flashbots.net/tx/${resNoLogs}`);
