import dotenv from "dotenv";
import { prepareClientWalletSender } from "./utils/prepare";
import { SampleJetton } from "../wrappers/SampleJetton";
import { Address } from "@ton/core";
import { JettonDefaultWallet } from "../build/SampleJetton/tact_JettonDefaultWallet";
dotenv.config();

async function main() {
  const { client, wallet, sender } = await prepareClientWalletSender();
  const balance = await client.getBalance(wallet.address);
  const owner = wallet.address;
  console.log("ton wallet address", owner);
  console.log("ton balance", balance);

  const jettonAddressString = process.env.TON_JETTON_ADDRESS || "";
  const jettonAddress = Address.parse(jettonAddressString);
  const jetton = client.open(SampleJetton.fromAddress(jettonAddress));
  const jettonWalletAddress = await jetton.getGetWalletAddress(owner);
  const jettonWallet = client.open(
    JettonDefaultWallet.fromAddress(jettonWalletAddress)
  );
  console.log("jetton wallet address", jettonWalletAddress);
  const jettonBalance = (await jettonWallet.getGetWalletData()).balance;
  console.log("jetton balance", jettonBalance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
