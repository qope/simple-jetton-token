import {
  beginCell,
  type Address,
  type Sender,
  type TonClient,
  toNano,
} from "@ton/ton";
import { SampleJetton } from "../../wrappers/SampleJetton";

export async function deployAndMintJetton(
  client: TonClient,
  sender: Sender,
  owner: Address,
  uri: string,
  maxSupply: bigint,
  initialMint: bigint
) {
  const content = beginCell()
    .storeUint(1, 8) // type 1 (Jetton)
    .storeStringTail(uri) // uri that contains the jetton metadata
    .endCell();
  const jetton = client.open(
    await SampleJetton.fromInit(owner, content, maxSupply)
  );

  // In TON, calling a method of an undeployed contract deploys the contract.
  // Here, the contract is deployed by calling the MINT method.
  await jetton.send(
    sender,
    {
      value: toNano("0.05"), // Gas fee. The excess will be returned
      bounce: true,
    },
    {
      $$type: "Mint",
      amount: initialMint,
      receiver: owner,
    }
  );
}
