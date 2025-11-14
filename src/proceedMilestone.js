import fs from "fs";
import { getClient } from "./client.js";
import { getAdminWallet, getVaultWallet, getBorrowerWallet } from "./utils.js";

const DEAL_STATE_FILE = "./dealState.json";

function loadDealState() {
  const raw = fs.readFileSync(DEAL_STATE_FILE, "utf8");
  return JSON.parse(raw);
}

function saveDealState(state) {
  fs.writeFileSync(DEAL_STATE_FILE, JSON.stringify(state, null, 2));
}

async function getVaultUsdBalance(client, issuer, vaultAddress) {
  const lines = await client.request({
    command: "account_lines",
    account: vaultAddress,
    ledger_index: "validated",
  });

  const usdLine = lines.result.lines.find(
    (l) => l.currency === "USD" && l.account === issuer
  );

  if (!usdLine) return 0;
  return parseFloat(usdLine.balance);
}

async function main() {
  const client = await getClient();
  const admin = await getAdminWallet();
  const vault = await getVaultWallet();
  const borrower = await getBorrowerWallet();

  const state = loadDealState();
  const i = state.currentMilestoneIndex;
  const milestones = state.milestones;

  if (i >= milestones.length) {
    console.log("All milestones already completed.");
    await client.disconnect();
    return;
  }

  const pct = milestones[i];
  console.log(`Proceeding milestone index ${i} with pct = ${pct}%`);

  // 1) Fetch vault balance
  const vaultBalance = await getVaultUsdBalance(
    client,
    admin.address,
    vault.address
  );
  console.log("Current vault USD balance:", vaultBalance);

  if (vaultBalance <= 0) {
    console.log("Vault empty, nothing to pay.");
    await client.disconnect();
    return;
  }

  // 2) Compute amount = vaultBalance * pct / 100
  const amount = (vaultBalance * pct) / 100;
  const amountStr = amount.toFixed(6);

  console.log(`Paying borrower ${amountStr} USD from vault via Payment.`);

  // 3) Direct Payment from VAULT -> BORROWER (IOU)
  const res = await client.submitAndWait(
    {
      TransactionType: "Payment",
      Account: vault.address,
      Destination: borrower.address,
      Amount: {
        currency: "USD",
        issuer: admin.address,
        value: amountStr,
      },
    },
    { wallet: vault }
  );

  console.log("RAW RESPONSE:");
  console.dir(res, { depth: null });

  const result = res.result ?? res;
  const engine = result.engine_result || result.meta?.TransactionResult;
  const hash = result.tx_json?.hash || result.hash;

  console.log("Payment engine_result:", engine);
  console.log("Payment tx hash:", hash);

  // 4) Increment milestone index & persist
  state.currentMilestoneIndex = i + 1;
  saveDealState(state);
  console.log("Updated dealState:", state);

  await client.disconnect();
}

main().catch(console.error);
