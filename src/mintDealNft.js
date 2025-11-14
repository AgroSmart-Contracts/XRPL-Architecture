import xrpl from "xrpl";
import { getClient } from "./client.js";
import { getAdminWallet } from "./utils.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = await getClient();
  const admin = await getAdminWallet();

  const metadata = {
    dealId: 1,
    borrower: process.env.BORROWER_ADDR,
    milestones: [20, 30, 50],
    maxDeposit: "1000 USD",
  };

  const uri = xrpl.convertStringToHex(
    "data:application/json," + JSON.stringify(metadata)
  );

  console.log("Minting NFT...");

  const res = await client.submitAndWait(
    {
      TransactionType: "NFTokenMint",
      Account: admin.address,
      URI: uri,
      NFTokenTaxon: 0,
      Flags: 1,
    },
    { wallet: admin }
  );

  // 🔍 Let's print the entire response so we can see the real fields
  console.log("RAW RESPONSE:");
  console.dir(res, { depth: null });

  // XRPL response can take multiple shapes:
  const result = res.result ?? res;
  const engine = result.engine_result || result.meta?.TransactionResult;
  const hash = result.tx_json?.hash || result.hash;

  console.log("Parsed engine_result:", engine);
  console.log("Parsed tx hash:", hash);

  console.log("Done.");

  await client.disconnect();
}

main().catch(console.error);
