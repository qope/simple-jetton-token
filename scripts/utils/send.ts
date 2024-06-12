import {
  toNano,
  type Address,
  type Sender,
  type TonClient,
  Cell,
} from "@ton/ton";
import { SampleJetton } from "../../wrappers/SampleJetton";
import { JettonDefaultWallet } from "../../build/SampleJetton/tact_JettonDefaultWallet";

export async function sendJetton(
  client: TonClient,
  sender: Sender,
  owner: Address,
  jettonAddress: Address,
  to: Address,
  amount: bigint
) {
  const jetton = client.open(SampleJetton.fromAddress(jettonAddress));
  const jettonWalletAddress = await jetton.getGetWalletAddress(owner);
  const jettonWallet = client.open(
    JettonDefaultWallet.fromAddress(jettonWalletAddress)
  );

  await jettonWallet.send(
    sender,
    {
      value: toNano("0.05"),
      bounce: true,
    },
    {
      $$type: "TokenTransfer",
      queryId: 0n,
      amount,
      destination: to,
      response_destination: owner,
      custom_payload: null,
      forward_ton_amount: 0n,
      forward_payload: new Cell(),
    }
  );
}
