import { ethers } from "ethers";
import { createRWA } from "./RWAfunctions.js";
import { decodeRevert } from "./decodeRevert.js";

/**
 * MUST be RWAManager owner
 */
const MANAGER_OWNER_PRIVATE_KEY =
  "0x63bd3e1ca3f56d1f21f2cc19ddcfbe4e844d0b0bba747f4ab3d4486337d97974";

async function run() {
  const TOTAL_SUPPLY = ethers.parseUnits("30000000000", 18);

  // 3 owners → equal split
  const mintPerUser = TOTAL_SUPPLY / 3n;

  const params = {
    name: "Asset One RWA",
    symbol: "A1RWA",
    assetId: 1,

    initialOwners: [
      "0xcf94c9757FB442C972A83A72f7592Ba853751FC8",
      "0x30086497C5e5F191878f9e06505D328c2b043E88",
      "0x0645D9eF7E19fb6D1D7062a842f01BD69E3db23F"
    ],

    mintAmounts: [
      mintPerUser,
      mintPerUser,
      mintPerUser
    ]
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

    const decoded = decodeRevert(e);

    if (decoded.name) {
      console.error("REVERT:", decoded.name);
      console.error("ARGS:", decoded.args);
    } else {
      console.error(decoded);
    }
  }
}

run();





