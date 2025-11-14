import { getClient } from "./client.js";
import { getAdminWallet, getVaultWallet } from "./utils.js";

async function main() {
  const client = await getClient();
  const admin = await getAdminWallet();
  const vault = await getVaultWallet();

  console.log("Admin:", admin.address);
  console.log("Vault:", vault.address);
  console.log("Funding vault with 1000 USD...");

  const res = await client.submitAndWait(
    {
      TransactionType: "Payment",
      Account: admin.address,
      Destination: vault.address,
      Amount: {
        currency: "USD",
        issuer: admin.address,
        value: "1000",
      },
    },
    { wallet: admin }
  );

  console.log("RAW RESPONSE:");
  console.dir(res, { depth: null });

  const result = res.result ?? res;
  const engine = result.engine_result || result.meta?.TransactionResult;
  const hash = result.tx_json?.hash || result.hash;

  console.log("Parsed engine_result:", engine);
  console.log("Parsed tx hash:", hash);

  await client.disconnect();
}

main().catch(console.error);
