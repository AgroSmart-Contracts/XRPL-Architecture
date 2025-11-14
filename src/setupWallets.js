import xrpl from "xrpl";
import { getClient } from "./client.js";

async function main() {
  const client = await getClient();

  const admin = xrpl.Wallet.generate();
  const vault = xrpl.Wallet.generate();
  const borrower = xrpl.Wallet.generate();

  console.log("==== GENERATED WALLETS ====");
  console.log("ADMIN ADDRESS:", admin.address);
  console.log("ADMIN SEED:", admin.seed);
  console.log("VAULT ADDRESS:", vault.address);
  console.log("VAULT SEED:", vault.seed);
  console.log("BORROWER ADDRESS:", borrower.address);
  console.log("BORROWER SEED:", borrower.seed);

  console.log(
    "\nGo to https://testnet.xrpl.org/faucet to fund these addresses with test XRP."
  );
  await client.disconnect();
}

main().catch(console.error);
