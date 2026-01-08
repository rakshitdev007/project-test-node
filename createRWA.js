import { ethers } from "ethers";
import { createRWA, ADDRESSES } from "./RWAfunctions.js";

/**
 * MUST be the OWNER of RWAManager
 */
const MANAGER_OWNER_PRIVATE_KEY =
  "0x63bd3e1ca3f56d1f21f2cc19ddcfbe4e844d0b0bba747f4ab3d4486337d97974";

async function run() {
  const params = {
    name: "Asset One RWA",
    symbol: "A1RWA",
    assetId: 1,

    // Identity registry is FIXED and verified on-chain
    identityRegistry: ADDRESSES.IdentityRegistry,

    // All owners already KYCed
    initialOwners: [
      "0xcf94c9757FB442C972A83A72f7592Ba853751FC8",
      "0x52DDB33eC735C7b32fFE1A1DCae30095424b3E66",
      "0x0645D9eF7E19fb6D1D7062a842f01BD69E3db23F",
      "0x30086497C5e5F191878f9e06505D328c2b043E88",
    ],

    // 25% each (10000 bps total)
    percentagesBps: [2500, 2500, 2500, 2500],

    // ERC20 with 18 decimals
    totalSupply: ethers.parseEther("10000000000"),

    // Manager = property owner OR governance wallet
    manager: "0xcf94c9757FB442C972A83A72f7592Ba853751FC8",
  };

  try {
    const receipt = await createRWA(
      MANAGER_OWNER_PRIVATE_KEY,
      params
    );

    console.log("RWA CREATED");
    console.log("Block:", receipt.blockNumber);
    console.log("TxHash:", receipt.hash);
  } catch (e) {
    console.error("CREATE RWA FAILED");
    console.error(e);
  }
}

run();
