import { getClient } from "./client.js";
import { getAdminWallet, getVaultWallet } from "./utils.js";

async function main() {
  const client = await getClient();
  const admin = await getAdminWallet();
  const vault = await getVaultWallet();

  console.log("Admin:", admin.address);
  console.log("Vault:", vault.address);

  const lines = await client.request({
    command: "account_lines",
    account: vault.address,
    ledger_index: "validated",
  });

  const usdLine = lines.result.lines.find(
    (l) => l.currency === "USD" && l.account === admin.address
  );

  if (!usdLine) {
    console.log("No USD trust line / balance found yet.");
  } else {
    console.log("Vault USD balance:", usdLine.balance);
  }

  await client.disconnect();
}

main().catch(console.error);
