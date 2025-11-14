import xrpl from "xrpl";
import { getClient } from "./client.js";
import dotenv from "dotenv";

dotenv.config();

export async function getAdminWallet() {
  // seed from .env
  const seed = process.env.ADMIN_SEED;
  if (!seed) throw new Error("ADMIN_SEED missing in .env");
  return xrpl.Wallet.fromSeed(seed);
}

export async function getVaultWallet() {
  const seed = process.env.VAULT_SEED;
  if (!seed) throw new Error("VAULT_SEED missing in .env");
  return xrpl.Wallet.fromSeed(seed);
}

export async function getBorrowerWallet() {
  const seed = process.env.BORROWER_SEED;
  if (!seed) throw new Error("BORROWER_SEED missing in .env");
  return xrpl.Wallet.fromSeed(seed);
}

// helper: sleep
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
