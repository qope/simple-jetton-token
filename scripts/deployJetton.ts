import { beginCell, toNano } from "@ton/core";
import { SampleJetton } from "../wrappers/SampleJetton";
import { prepareClientWalletSender } from "./utils/prepare";
import { deployAndMintJetton } from "./utils/deploy";

async function main() {
  const { client, wallet, sender } = await prepareClientWalletSender();

  // uri that contains the jetton metadata
  // ref: https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
  const uri = "https://run.mocky.io/v3/c0afa6dd-a306-43d7-aa0e-d18746c6a289";
  // max supply of the jetton
  const maxSupply = toNano(10000);
  const owner = wallet.address;

  await deployAndMintJetton(
    client,
    sender,
    owner,
    uri,
    maxSupply,
    toNano(1000)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
