
# TruMarket – XRPL Migration (Demo Day Technical Architecture)

## 1. Overview
This document describes TruMarket’s migration from an EVM-based smart-contract vault to an XRPL-native settlement and vault architecture. It includes diagrams, flows, blockers, roadmap, and Demo Day requirements.

---

## 2. Legacy Architecture (Before XRPL)

![Legacy Flow](./legacy_flow.png)

### Summary
- Investors onboard via Privy/Web3Auth → an EVM wallet is created.
- Investors deposit USDC on Base.
- Funds enter an ERC4626 Solidity vault.
- Milestone payouts executed by Solidity.
- Borrowers often paid off-chain.
- Smart-contract security risks + no FX + no multi-currency.

---

## 3. New XRPL-Native Architecture (Chosen Direction)

![XRPL Flow](./xrpl_flow.png)

### Key Changes
- Vault logic moved from Solidity → XRPL.
- Investor USDC deposits remain on EVM **for onboarding UX**.
- Backend mirrors deposits to XRPL Vault as **USD.IOU**.
- Investors receive XRPL Shares (SHRx).
- Milestone payouts issued as XRPL Payments.
- Borrowers fully paid on XRPL.
- XRPL becomes the core settlement + accounting layer.

---

## 4. What XRPL Features We Use
- **Issued Currencies (IOUs)** → USD.IOU, SHRx.
- **Trustlines** for vault, investors, borrowers.
- **XRPL Payment transactions** for milestone payouts.
- **XRPL Accounts** for treasury, vault, issuer.
- **Pathfinding / AMM (future)** for multi-currency payouts.

---

## 5. Current Integration Stage (Live Today)
- XRPL Accounts created (Issuer, Treasury, Vault, Borrower).
- Trustlines established.
- USD.IOU issuance working.
- SHRx share minting done.
- Vault funding done.
- Milestone payout working on XRPL Testnet.

---

## 6. Blockers
### 1. Cross-Chain Synchronization  
Backend must mirror:
- USDC deposits on EVM → USD.IOU on XRPL  
- SHRx burns on XRPL → USDC returns on EVM  

### 2. Redemption Flow  
Burn shares → return USD.IOU → send USDC on EVM.

### 3. XRPL Wallet Management  
Backend custodial creation + trustlines per investor.

### 4. FX Routing  
Pathfinding or AMM integration for borrower payouts.

---

## 7. Roadmap

### Before Demo Day
- Complete redemption flow.
- Connect frontend to XRPL vault.
- Live XRPL Testnet demo with investor → vault → borrower.
- Recorded fallback demo.

### After Grant
- Move to XRPL Mainnet.
- Integrate RLUSD when available.
- Borrower FX via AMM/pathfinding.
- Compliance tooling (Clawback/Freeze).
- Larger exporter onboarding.

---

## 8. Why XRPL (Grant-Friendly)
- Removes all smart contract risk.
- Native multi-currency payment layer.
- Designed for global settlement.
- Transparent IOU-based accounting.
- Perfect fit for cross-border trade finance.
- TruMarket drives new TVL + activity to XRPL.

---

## 9. Demo Day Checklist
**Technical Demo:**
- Current architecture → ✔  
- New XRPL architecture → ✔  
- XRPL components used → ✔  
- Live Testnet demo → ✔  
- Roadmap + blockers → ✔  

**Investor Pitch:**
- Problem: exporters need fast liquidity.
- Market: $5T trade finance gap.
- Traction: EVM MVP + XRPL version live.
- Why XRPL: global settlement, FX, no smart contract risks.
- Team: show credibility.
- Ask: Funding + Ripple integrations.

---

## 10. Final Notes from Mentor Meeting
- RLUSD optional; current USD.IOU approach valid.
- MoonPay not required if XRPL cross-currency payments used.
- Communication between EVM ↔ XRPL handled in backend.

---

## 11. Files
- **legacy_flow.png**
- **xrpl_flow.png**

This README is ready for Demo Day, mentors, and grant submission.
