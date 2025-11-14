import { getClient } from "./client.js";
import { getAdminWallet, getVaultWallet, getBorrowerWallet } from "./utils.js";
import fs from "fs";

const DEAL_STATE_FILE = "./dealState.json";

function loadDealState() {
  const raw = fs.readFileSync(DEAL_STATE_FILE, "utf8");
  return JSON.parse(raw);
}

async function getIOUBalance(client, issuer, account, currency) {
  const lines = await client.request({
    command: "account_lines",
    account,
    ledger_index: "validated",
  });

  const line = lines.result.lines.find(
    (l) => l.currency === currency && l.account === issuer
  );
  return line ? line.balance : "0";
}

async function main() {
  const client = await getClient();
  const admin = await getAdminWallet();
  const vault = await getVaultWallet();
  const borrower = await getBorrowerWallet();

  const state = loadDealState();

  const vaultBalance = await getIOUBalance(
    client,
    admin.address,
    vault.address,
    "USD"
  );
  const borrowerBalance = await getIOUBalance(
    client,
    admin.address,
    borrower.address,
    "USD"
  );

  console.log("========= DEAL STATE =========");
  console.log("Current milestone index:", state.currentMilestoneIndex);
  console.log("Milestone percentages:", state.milestones);
  console.log("------------------------------");
  console.log("Vault:", vault.address);
  console.log("Vault USD balance:", vaultBalance);
  console.log("------------------------------");
  console.log("Borrower:", borrower.address);
  console.log("Borrower USD balance:", borrowerBalance);

  await client.disconnect();
}

main().catch(console.error);
