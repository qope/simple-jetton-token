import { Address, Cell, toNano } from "@ton/ton";

import { SampleJetton } from "../wrappers/SampleJetton";
import { JettonDefaultWallet } from "../build/SampleJetton/tact_JettonDefaultWallet";
import { prepareClientWalletSender } from "./utils/prepare";

const jettonAddressString = "EQB4N65OBmj372W-a5TfhkCVi8cngt0WhBkBsBF2dI2yNTZN";

async function main() {
  const { client, wallet, sender } = await prepareClientWalletSender();

  const jettonAddress = Address.parse(jettonAddressString);
  const jetton = client.open(SampleJetton.fromAddress(jettonAddress));
  const jettonWalletAddress = await jetton.getGetWalletAddress(wallet.address);
  const jettonWallet = client.open(
    JettonDefaultWallet.fromAddress(jettonWalletAddress)
  );
  const jettonBalance = (await jettonWallet.getGetWalletData()).balance;
  console.log("jetton balance", jettonBalance);

  await jettonWallet.send(
    sender,
    {
      value: toNano("0.1"),
      bounce: true,
    },
    {
      $$type: "TokenTransfer",
      queryId: 0n,
      amount: toNano(1), // send 1 jetton
      destination: wallet.address, // send back to the wallet
      response_destination: wallet.address,
      custom_payload: null,
      forward_ton_amount: 0n,
      forward_payload: new Cell(),
    }
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
