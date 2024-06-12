import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV3R2, beginCell, toNano } from "@ton/ton";
import dotenv from "dotenv";
import { SampleJetton } from "../wrappers/SampleJetton";
dotenv.config();

// uri that contains the jetton metadata
// ref: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
const uri = "https://run.mocky.io/v3/c0afa6dd-a306-43d7-aa0e-d18746c6a289";

// max supply of the jetton
const maxSupply = toNano(10000);

async function main() {
  const tonCenterRPCURL = process.env.TON_CENTER_RPC_URL || "";
  const client = new TonClient({
    endpoint: tonCenterRPCURL,
  });
  const mnemonics = process.env.TON_MNEMONIC || "";
  const keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
  const wallet = WalletContractV3R2.create({
    workchain: 0, // mainnet
    publicKey: keyPair.publicKey,
  });
  const walletContract = client.open(wallet);
  const sender = walletContract.sender(keyPair.secretKey);

  const owner = wallet.address;
  const content = beginCell()
    .storeUint(1, 8) // type 1 (Jetton)
    .storeStringTail(uri) // uri that contains the jetton metadata
    .endCell();
  const jetton = client.open(
    await SampleJetton.fromInit(owner, content, maxSupply)
  );

  await jetton.send(
    sender,
    {
      value: toNano("0.05"),
      bounce: true,
    },
    {
      $$type: "Mint",
      amount: toNano(10),
      receiver: owner,
    }
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
