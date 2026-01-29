import { ethers } from "ethers";
import db from "./db";

const RPC_URL = process.env.RPC_URL;
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // mainnet
const CONFIRMATIONS = 3;

const provider = new ethers.JsonRpcProvider(RPC_URL);

const USDT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);

console.log("USDT listener started...");

usdt.on("Transfer", async (from, to, value, event) => {
  try {
    const depositAddress = to.toLowerCase();

    // 1. Check if address belongs to any user
    const user = await db.users.findOne({
      where: { deposit_address: depositAddress }
    });

    if (!user) return;

    // 2. Wait for confirmations
    const receipt = await event.getTransactionReceipt();
    if (receipt.confirmations < CONFIRMATIONS) return;

    // 3. Idempotency check
    const exists = await db.deposits.findOne({
      where: { tx_hash: receipt.hash }
    });
    if (exists) return;

    const amount = Number(ethers.formatUnits(value, 6));

    // 4. Store deposit
    await db.deposits.create({
      user_id: user.id,
      tx_hash: receipt.hash,
      amount,
      status: "confirmed"
    });

    // 5. Increase trade power
    const tradePowerIncrement = amount * 10; // your logic

    await db.users.update(
      { trade_power: user.trade_power + tradePowerIncrement },
      { where: { id: user.id } }
    );

    console.log(
      `Deposit confirmed | User ${user.id} | ${amount} USDT`
    );
  } catch (err) {
    console.error("Listener error:", err);
  }
});
