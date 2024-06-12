import dotenv from "dotenv";
import { prepareClientWalletSender } from "./utils/prepare";
dotenv.config();

async function main() {
  const { client, wallet, sender } = await prepareClientWalletSender();
  const balance = await client.getBalance(wallet.address);

  console.log("wallet address", wallet.address);
  console.log("ton balance", balance);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
