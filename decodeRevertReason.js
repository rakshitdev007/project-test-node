import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const txHash = "0xead68482c3203d0a16cf5264ac5802c7fab7bfc40775e2d79dd6cfc525e07e30";

async function decodeRevert() {
  const tx = await provider.getTransaction(txHash);
  try {
    const code = await provider.call(tx, tx.blockNumber);
    // If the call fails, it will throw an error with the revert reason
  } catch (error) {
    console.log("Revert reason:", error ,"\nMessage", error.message);
    // For custom errors, you may need to parse the error data
    if (error.data) {
      const reason = ethers.utils.toUtf8String(error.data);
      console.log("Revert data:", reason);
    }
  }
}

decodeRevert();
