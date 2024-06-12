import { Address, Cell, toNano } from "@ton/ton";
import { SampleJetton } from "../wrappers/SampleJetton";
import { JettonDefaultWallet } from "../build/SampleJetton/tact_JettonDefaultWallet";
import { prepareClientWalletSender } from "./utils/prepare";
import dotenv from "dotenv";
import { sendJetton } from "./utils/send";
dotenv.config();

async function main() {
  const { client, wallet, sender } = await prepareClientWalletSender();

  const jettonAddressString = process.env.TON_JETTON_ADDRESS || "";
  const jettonAddress = Address.parse(jettonAddressString);
  const owner = wallet.address;
  const to = owner; // send back to the owner
  await sendJetton(client, sender, owner, jettonAddress, to, toNano(10));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
