import { Wallet } from "ethers";

const wallet = new Wallet("0x796ec1292a19dce4f0d8e921efb15e07861c05882552d86121670d0d75d55965");
console.log("\nOne-liner style:");
console.log("Address →", wallet.address);