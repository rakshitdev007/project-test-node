import { ethers } from "ethers";

// Replace with your Ethereum provider URL (e.g., from Alchemy or Infura)
// This example uses a WebSocket for real-time updates
const providerUrl = 'wss://sonic-testnet-v2.drpc.org'; // Get a free API key from alchemy.com

// The Ethereum address to monitor (replace with your target address)
const targetAddress = '0xB609099b6BBaB96b126d2542A8d521D6ECf448F0'.toLowerCase();

async function monitorAddress() {
    // Connect to the Ethereum network via WebSocket for real-time block notifications
    const provider = new ethers.WebSocketProvider(providerUrl);

    console.log(`Monitoring transactions for address: ${targetAddress}`);

    // Listen for new blocks
    provider.on('transactions', async (blockNumber) => {
        console.log(blockNumber)
    });

    // Handle WebSocket errors and reconnection (basic example)
    provider.websocket.on('error', (error) => {
        console.error('WebSocket error:', error);
        // You can add reconnection logic here
    });

    provider.websocket.on('close', () => {
        console.log('WebSocket closed. Attempting to reconnect...');
        // Reconnect logic: You might want to wrap this in a retry function
    });
}

monitorAddress();

// Keep the script running indefinitely
process.on('SIGINT', () => {
    console.log('Shutting down monitor...');
    process.exit(0);
});