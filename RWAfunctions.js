import { ethers } from "ethers";
import "dotenv/config";

/* ============================================================
   GLOBAL CONFIG
============================================================ */

const RPC_URL = process.env.RPC_BNB;
export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const ADDRESSES = {
  RWAManager: "0x09f4d865A607d655D84EEDf238809851788D4E66",
  LegalRegistry: "0xaD7aA9d3d97C197d348515355A2e95eF55A396E7",
  IdentityRegistry: "0x2DeE24E629e0135070d84164D38fbB35E2206148",
};

/* ============================================================
   ABIs (LATEST + EXACT)
============================================================ */

/* ---------- RWAManager ---------- */
export const RWAManagerABI = [
  "function createRWA(string name,string symbol,uint256 assetId,address[] initialOwners,uint256[] mintAmounts) returns (address)",
  "function rwaByAsset(uint256) view returns (address)",
  "function totalRWAs() view returns (uint256)",
  "function getAllRWATokens() view returns (address[])",
  "function getRWATokens(uint256 page,uint256 limit) view returns (address[])",

  "error ZeroAddress()",
  "error AssetNotApproved()",
  "error AlreadyTokenized()",
  "error InvalidDistribution()",
  "error IdentityMissing(address)",
  "error CountryMismatch(address,string,string)",
];

/* ---------- LegalRegistry ---------- */
export const LegalRegistryABI = [
  "function requestAsset(string countryCode,string documentURI) returns (uint256)",
  "function reRequestAsset(uint256,string,string)",
  "function approve(uint256)",
  "function disapprove(uint256,string)",
  "function isAssetApproved(uint256) view returns (bool)",
  "function getAsset(uint256) view returns (address,string,string,uint8)",
  "function totalAssets() view returns (uint256)",

  "error InvalidStatus()",
  "error NotOwner()",
  "error IdentityNotVerified()",
  "error JurisdictionMismatch()",
];

/* ---------- IdentityRegistry ---------- */
export const IdentityRegistryABI = [
  "function registerIdentity(address,uint256,string,string,uint8,uint8,uint8)",
  "function updateIdentity(address,uint256,string,string,uint8,uint8,uint8)",
  "function revokeIdentity(address)",
  "function hasValidIdentity(address) view returns (bool)",
  "function getIdentity(address) view returns (tuple(uint256 verifiedTill,string identityURI,string countryCode,uint8 level,uint8 risk,uint8 class))",

  "error ZeroAddress()",
  "error IdentityAlreadyVerified()",
  "error IdentityDoesNotExist()",
  "error IdentityInvalid(address)",
];

/* ============================================================
   UTILITIES
============================================================ */

function getSigner(privateKey) {
  return new ethers.Wallet(privateKey, provider);
}

function getContracts(privateKey) {
  const signer = getSigner(privateKey);

  return {
    signer,
    rwaManager: new ethers.Contract(
      ADDRESSES.RWAManager,
      RWAManagerABI,
      signer
    ),
    legalRegistry: new ethers.Contract(
      ADDRESSES.LegalRegistry,
      LegalRegistryABI,
      signer
    ),
    identityRegistry: new ethers.Contract(
      ADDRESSES.IdentityRegistry,
      IdentityRegistryABI,
      signer
    ),
  };
}

/* ============================================================
   ERROR DECODER
============================================================ */

export function decodeError(err, extraAbi = []) {
  try {
    const iface = new ethers.Interface([
      ...RWAManagerABI,
      ...LegalRegistryABI,
      ...IdentityRegistryABI,
      ...extraAbi,
    ]);

    const decoded = iface.parseError(err.data);
    return { name: decoded.name, args: decoded.args };
  } catch {
    return { raw: err?.data || err };
  }
}

/* ============================================================
   IDENTITY REGISTRY
============================================================ */

export async function registerIdentity(
  privateKey,
  {
    user,
    verifiedTill,
    identityURI,
    countryCode,   // e.g. "+91", "IN"
    level,         // 0,1,2
    risk,          // 0,1,2
    investorClass, // 0,1,2
  }
) {
  const { identityRegistry } = getContracts(privateKey);
  try {
    const tx = await identityRegistry.registerIdentity(
      user,
      verifiedTill,
      identityURI,
      countryCode,
      level,
      risk,
      investorClass
    );
    return await tx.wait();
  } catch (err) {
    throw decodeError(err);
  }
}

export async function getIdentity(user) {
  const identityRegistry = new ethers.Contract(
    ADDRESSES.IdentityRegistry,
    IdentityRegistryABI,
    provider
  );
  return identityRegistry.getIdentity(user);
}

/* ============================================================
   LEGAL REGISTRY
============================================================ */

export async function requestAsset(privateKey, countryCode, documentURI) {
  const { legalRegistry } = getContracts(privateKey);
  try {
    const tx = await legalRegistry.requestAsset(countryCode, documentURI);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map(log => {
        try {
          return legalRegistry.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find(e => e?.name === "AssetRequested");

    return event?.args.assetId;
  } catch (err) {
    throw decodeError(err);
  }
}

export async function approveAsset(privateKey, assetId) {
  const { legalRegistry } = getContracts(privateKey);
  try {
    const tx = await legalRegistry.approve(assetId);
    return await tx.wait();
  } catch (err) {
    throw decodeError(err);
  }
}

/* ============================================================
   RWA MANAGER
============================================================ */

export async function createRWA(
  privateKey,
  {
    name,
    symbol,
    assetId,
    initialOwners,
    mintAmounts,
  }
) {
  const { rwaManager } = getContracts(privateKey);
  try {
    const tx = await rwaManager.createRWA(
      name,
      symbol,
      assetId,
      initialOwners,
      mintAmounts
    );
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    throw decodeError(err);
  }
}

export async function getRWAToken(assetId) {
  const rwaManager = new ethers.Contract(
    ADDRESSES.RWAManager,
    RWAManagerABI,
    provider
  );
  return rwaManager.rwaByAsset(assetId);
}

const { legalRegistry } = getContracts("0x63bd3e1ca3f56d1f21f2cc19ddcfbe4e844d0b0bba747f4ab3d4486337d97974");
// const asset = await legalRegistry.getAsset(1);
// console.log("Asset:", asset);

const { identityRegistry } = getContracts("0x63bd3e1ca3f56d1f21f2cc19ddcfbe4e844d0b0bba747f4ab3d4486337d97974");
// for (const owner of [
//       "0xcf94c9757FB442C972A83A72f7592Ba853751FC8",
//       "0x30086497C5e5F191878f9e06505D328c2b043E88",
//       "0x0645D9eF7E19fb6D1D7062a842f01BD69E3db23F"
//     ]) {
//   const identity = await identityRegistry.getIdentity(owner);
//   console.log(`Owner ${owner} country code:`, identity.countryCode);
// }


const asset = await legalRegistry.getAsset(1);
console.log("Asset country code:", asset[1]);

const identity = await identityRegistry.getIdentity("0xcf94c9757FB442C972A83A72f7592Ba853751FC8");
console.log("Owner country code:", identity.countryCode)


