// import axios from "axios";
// import "dotenv/config";

// const API_KEY = "S1BZ589PXTJPCQUMV1QCDBFBHSJ9GK7K2Q";

// async function getLastTwoTx(address) {
//   const { data } = await axios.get(
//     "https://api.etherscan.io/v2/api",
//     {
//       params: {
//         module: "account",
//         action: "txlist",
//         address,
//         startblock: 0,
//         endblock: 99999999,
//         sort: "desc",
//         chainid: 11155111,
//         apikey: API_KEY,
//       },
//     }
//   );

//   if (data.status !== "1") {
//     throw new Error(data.result);
//   }

//   return data.result.slice(0, 2);
// }

// (async () => {
//   const txs = await getLastTwoTx(
//     "0x107f9b818A14eA92C889573cBBee486Fea608B4B"
//   );
//   console.log(txs);
// })();



import Moralis from "moralis";
import "dotenv/config";

const CHAINS = {
  SEPOLIA: "0xaa36a7",
  BNB_TESTNET: "0x61",
  POLYGON_AMOY: "0x13882",
};

async function getLast2Transactions(address, chainId) {
  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain: chainId,
    limit: 2,
  });

  return response.raw.result.map(tx => ({
    hash: tx.hash,
    from: tx.from_address,
    to: tx.to_address,
    value: tx.value,
    blockNumber: tx.block_number,
    timestamp: tx.block_timestamp,
  }));
}

async function main() {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQzMWM3ZGQ5LWU0MWUtNDhjYS04NWYzLTMzZmViNzhlNTliZCIsIm9yZ0lkIjoiNDgyMjU1IiwidXNlcklkIjoiNDk2MTQwIiwidHlwZUlkIjoiZDA2MmQzZWQtOWExYi00ZmMyLTliNTktODYxYTRmYTA4ZDQ4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NjM2MTUwNjMsImV4cCI6NDkxOTM3NTA2M30.MmVeuYxfY6HmLbHXMIrrUxts3uQ7vGxj90Vxyr5Yddg",
  });

  const walletAddress = "0x107f9b818A14eA92C889573cBBee486Fea608B4B";

  console.log("Sepolia:");
  console.log(await getLast2Transactions(walletAddress, CHAINS.SEPOLIA));

  console.log("BNB Testnet:");
  console.log(await getLast2Transactions(walletAddress, CHAINS.BNB_TESTNET));

  console.log("Polygon Amoy:");
  console.log(await getLast2Transactions(walletAddress, CHAINS.POLYGON_AMOY));
}

main().catch(console.error);
