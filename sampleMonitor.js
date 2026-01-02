import { ethers } from "ethers";
import "dotenv/config";

const WSS_URL = "wss://bsc-mainnet.infura.io/ws/v3/5fbcee284d2d48baa3b1f2ee0090a160";
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT mainnet
// const WSS_URL = "wss://bsc-testnet-rpc.publicnode.com";
// const USDT_ADDRESS = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // BSC testnet mainnet

// Minimal ABI for Transfer events
const USDT_ABI = [
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function decimals() view returns (uint8)"
];

async function main() {
    const provider = new ethers.WebSocketProvider(WSS_URL);
    const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);
    const { chainId } = await provider.getNetwork();
    console.log(chainId)
    const decimals = await usdt.decimals();
    console.log(`👀 USDT monitor started with ${decimals} decimals`);

    usdt.on("Transfer", (from, to, value, event) => {
        const amount = Number(ethers.formatUnits(value, decimals));
        console.log(`📥 Transfer detected`);
        // console.log(event)
        console.log(`  txHash: ${event.log.transactionHash}`);
        console.log(`  block: ${event.log.blockNumber}`);
        console.log(`  from: ${from}`);
        console.log(`  to: ${to}`);
        console.log(`  amount: ${amount} USDT`);
        console.log("========================================");
    });

    provider._websocket.on("close", (code) => {
        console.error(`❌ WebSocket closed with code ${code}. Attempting reconnect...`);
        setTimeout(main, 5000); // simple reconnect
    });
}

main().catch(console.error);
