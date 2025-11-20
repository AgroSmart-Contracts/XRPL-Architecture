# TruMarket – XRPL Migration (Demo Day Technical Architecture)

## 1. Overview

TruMarket is transitioning from an EVM-based vault system (Solidity ERC4626) to a native XRPL settlement vault architecture designed to improve safety, reduce smart contract risk, simplify accounting, and enable global cross-border trade settlement.

Our architecture now uses XRPL for:

- USD liquidity custody
- Share issuance
- Milestone payouts
- Deal indexing
- Borrower settlements

EVM remains only for temporary USDC onboarding until off-ramp/on-ramp partners (Iron, etc.) are integrated.

---

## 2. Legacy Architecture

![Legacy Architecture](legacy_flow.png)


### Key Issues:

- Complex Solidity vault (1200+ lines).
- High smart contract attack surface.
- No multi-currency capabilities.
- Off-chain borrower settlements.
- Expensive audits, slow iteration.

---

## 3. New XRPL Native Architecture

TruMarket now uses XRPL as the **settlement engine** for all vault operations, payouts, and accounting.

![New XRPL Architecture](xrpl_flow.png)


### Why XRPL?

- Eliminates Solidity vault (no code = no exploit).
- Uses deterministic ledger primitives.
- Native Issued Currencies (IOUs) for accounting.
- Native Payments for settlement.
- Multi-currency payouts via AMM or Pathfinding.
- True global reach for exporters.

---

## 4. What Is the XRPL Vault?

### XRPL Vault =

✔ An XRPL Account  
✔ Holding a USD.IOU trustline  
✔ Controlled by issuer/treasury  
✔ Receives USD.IOU when investors deposit  
✔ Sends milestone payouts via XRPL Payment  
✔ Fully transparent and immune to smart-contract attack vectors

### Why this is safer:

No:

- Reentrancy
- Integer math bugs
- State desync
- Inflation exploits
- Complex share math
- Upgrade logic failures

XRPL ledger rules enforce all invariants.

---

## 5. XRPL Primitives Used in trumarket-XRPL

The following XRPL native primitives are implemented and actively used:

- **Issued Currencies (IOUs)**: USD.IOU (issued by admin, held in vaults), SHRx (shares minted to investors)
- **Trustlines**: Automatically set up for vaults, borrowers, and investors to hold USD.IOU and SHRx
- **XRPL Payments**: Used for milestone payouts (vault → borrower) and USD.IOU returns (vault → investor)
- **XRPL Accounts**: Native accounts for vaults (one per deal), borrowers (one per deal), investors (one per user), and admin/issuer
- **XRPL NFTs**: Deal NFTs with metadata (dealId, milestones, maxDeposit)
- **AccountLines API**: Used to query balances and trustlines for USD.IOU and SHRx

**Note:** All features used are native XRPL primitives - no smart contracts required.

---

## 6. Cross-Chain Architecture (EVM ↔ XRPL)

TruMarket backend mirrors deposits:

1. Investor deposits USDC on EVM.
2. Backend issues USD.IOU to XRPL Vault.
3. Backend mints SHRx shares to investor XRPL wallet.
4. Milestones trigger XRP Ledger payments.
5. Redemption burns SHRx and backend returns USDC to investor.

This avoids bridges AND smart contracts.

---

## 7. Current Blockers & Implementation Status


#### 2. Redemption USDC Return ⚠️ **PARTIAL**

**What's Done:**

- ✅ SHRx burn from investor wallet
- ✅ USD.IOU return from vault to investor
- ✅ Redemption endpoint (`POST /xrpl/redeem`)

**What's Blocking:**

- ❌ USDC transfer from treasury to investor EVM wallet
- ❌ Complete redemption cycle (currently stops at USD.IOU return)


### ❌ Future Blockers (Not Blocking Current Demo)

#### 4. FX + Off-Ramping ❌ **NOT STARTED**

- Multi-currency payouts (NGN, KES, ZAR, EGP, PHP, MXN)
- XRPL AMM integration
- Third-party partner integration (Iron, etc.)

---

## 8. Roadmap

**✅ Completed:**

- ✅ Deposit flow (automatic detection + USD.IOU issuance + SHRx minting)
- ✅ Vault creation (automated per deal)
- ✅ Borrower creation (automated per deal)
- ✅ Trustline setup (fully automated)
- ✅ Investor wallet creation (automatic on signup)
- ✅ Milestone payouts (XRPL Payments)
- ✅ Deal NFT minting (XRPL NFTs)
- ✅ Full Testnet demo (investor → vault → borrower flow)

**⚠️ In Progress:**

- ⚠️ Redemption flow (XRPL side done, USDC return to EVM pending)
- ⚠️ Integrating On-Ramp/Off-Ramp solution

**Status:** ✅ **Ready for Demo Day** - Core functionality complete, minor gaps remain

### Post-Grant (1–2 Months)

- Integrate **Iron** for African payout rails
- Integrate global off-ramp providers that support XRPL
- Enable payouts in NGN, KES, ZAR, EGP, PHP, MXN via partners
- Implement XRPL AMM for local currency settlement
- Reduce dependency on EVM treasury
- Complete USDC return for redemption
- Production security hardening (encryption, rate limiting, audit logging)

### Long-Term (Full XRPL Migration)

- Entire vault + settlement moves to XRPL
- EVM layer becomes optional (only for USDC onboarding if needed)
- Potential use of RLUSD once live
- Eventually eliminate EVM completely

---

## 9. Investor Pitch – Why XRPL?

- Eliminates Solidity vault (no code = no exploit)
- Global settlement (instant cross-border payments)
- Multi-currency (via XRPL AMM and partners)
- Instant payments (XRPL native speed)
- No bridges needed (backend mirrors, no bridge risk)

---

This README provides the complete Demo Day technical foundation.
