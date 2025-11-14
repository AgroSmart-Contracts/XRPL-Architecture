import { getClient } from "./client.js";
import { getAdminWallet, getVaultWallet, getBorrowerWallet } from "./utils.js";

async function main() {
  const client = await getClient();
  const admin = await getAdminWallet();
  const vault = await getVaultWallet();
  const borrower = await getBorrowerWallet();

  console.log("Admin:", admin.address);
  console.log("Vault:", vault.address);
  console.log("Borrower:", borrower.address);

  // 1) Create trust line: VAULT trusts ADMIN's USD
  console.log("Setting trust line for VAULT -> USD...");
  await client.submitAndWait(
    {
      TransactionType: "TrustSet",
      Account: vault.address,
      LimitAmount: {
        currency: "USD",
        issuer: admin.address,
        value: "1000000", // max vault can hold
      },
    },
    { wallet: vault }
  );

  // 2) Create trust line: BORROWER trusts ADMIN's USD
  console.log("Setting trust line for BORROWER -> USD...");
  await client.submitAndWait(
    {
      TransactionType: "TrustSet",
      Account: borrower.address,
      LimitAmount: {
        currency: "USD",
        issuer: admin.address,
        value: "1000000",
      },
    },
    { wallet: borrower }
  );

  console.log("Trust lines set.");

  await client.disconnect();
}

main().catch(console.error);
