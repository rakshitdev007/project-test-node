import dotenv from "dotenv";
import fetch from "node-fetch";
import { ethers } from "ethers";
import fs from "fs";
const marketplaceAbi = JSON.parse(fs.readFileSync("./abi/Marketplace.json", "utf-8"));

dotenv.config();

const CHAINS = {
  ethereum: {
    rpc: process.env.RPC_ETHEREUM,
    address: process.env.CONTRACT_ETHEREUM,
  },
  polygon: {
    rpc: process.env.RPC_POLYGON,
    address: process.env.CONTRACT_POLYGON,
  },
  bnb: {
    rpc: process.env.RPC_BNB,
    address: process.env.CONTRACT_BNB,
  },
};

// Step 1️⃣ — Fetch backend data
async function fetchBackendProducts() {
  const res = await fetch(`${process.env.API_BASE_URL}api/v1/marketplace/list/?page_size=1000`);
  if (!res.ok) throw new Error(`Backend error: ${res.status}`);
  const data = await res.json();
  return data.results;
}

// Step 2️⃣ — Fetch on-chain product data
async function fetchOnChainProducts(chainKey, products) {
  const { rpc, address } = CHAINS[chainKey];
  const provider = new ethers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(address, marketplaceAbi, provider);

  const chainData = [];

  for (const p of products) {
    try {
      // Assuming contract function: getProduct(uint256 id)
      const onchainId = p.onchain_id || p.id; // replace with actual mapping
      const productData = await contract.getProduct(onchainId);

      chainData.push({
        onchainId,
        backendId: p.id,
        chain: chainKey,
        priceInWei: productData.price?.toString(),
        owner: productData.owner,
        isActive: productData.isActive,
      });
    } catch (err) {
      console.error(`Failed fetching product ${p.id} on ${chainKey}:`, err.message);
    }
  }

  return chainData;
}

// Step 3️⃣ — Main runner
async function main() {
  console.log("⏳ Fetching backend products...");
  const backendProducts = await fetchBackendProducts();
  fs.writeFileSync("backend-products.json", JSON.stringify(backendProducts, null, 2));
  console.log(`✅ Saved ${backendProducts.length} backend products.`);

  const allChainsData = [];
  for (const chain of Object.keys(CHAINS)) {
    console.log(`🔗 Fetching on-chain data for ${chain}...`);
    const chainData = await fetchOnChainProducts(chain, backendProducts);
    allChainsData.push(...chainData);
  }

  fs.writeFileSync("onchain-products.json", JSON.stringify(allChainsData, null, 2));
  console.log("✅ Saved on-chain data for all products!");
}

main().catch(console.error);
