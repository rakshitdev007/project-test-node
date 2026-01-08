import { ethers } from "ethers";
import "dotenv/config";

/* ============================================================
   GLOBAL CONFIG
============================================================ */

const RPC_URL = process.env.RPC_BNB;
export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const ADDRESSES = {
  RWAManager: "0xc370093A31ec14cF20EBa0513fcf221bd29FD152",
  LegalRegistry: "0xccf812cCaEE90E3cd97d637F17779696Eb8965f1",
  IdentityRegistry: "0xFcd2f30F64CA11828f45922E924A88de31EE902B",
};

/* ============================================================
   ABIs (MINIMAL + ERRORS)
============================================================ */

export const RWAManagerABI = [
  "function createRWA((string,string,uint256,address,address[],uint256[],uint256,address)) returns (address)",
  "function rwaByAsset(uint256) view returns (address)",
  "error AssetNotApproved()",
  "error AlreadyTokenized()",
];

export const LegalRegistryABI = [
  "function requestAsset(string,string) returns (uint256)",
  "function approve(uint256)",
  "function disapprove(uint256,string)",
  "function isAssetApproved(uint256) view returns (bool)",
  "function getAsset(uint256) view returns (address,string,string,uint8)",
  "function getTotalAssets() view returns (uint256)",
  "error InvalidStatus()",
  "error NotOwner()",
];

export const IdentityRegistryABI = [
  "function registerIdentity(address,string)",
  "function revokeIdentity(address)",
  "function hasIdentity(address) view returns (bool)",
  "error IdentityAlreadyExists()",
  "error IdentityDoesNotExist()",
  "error ZeroAddress()",
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

/**
 * Universal revert decoder
 */
export function decodeError(err, abiList = []) {
  const allAbis = [...RWAManagerABI, ...LegalRegistryABI, ...IdentityRegistryABI, ...abiList];

  try {
    const iface = new ethers.Interface(allAbis);
    const decoded = iface.parseError(err.data);
    return { name: decoded.name, args: decoded.args };
  } catch {
    return { raw: err.data || err };
  }
}

/* ============================================================
   IDENTITY REGISTRY FUNCTIONS
============================================================ */

export async function registerIdentity(privateKey, user, identityURI) {
  const { identityRegistry } = getContracts(privateKey);
  try {
    const tx = await identityRegistry.registerIdentity(user, identityURI);
    return await tx.wait();
  } catch (err) {
    throw decodeError(err);
  }
}

export async function hasIdentity(user) {
  const identityRegistry = new ethers.Contract(
    ADDRESSES.IdentityRegistry,
    IdentityRegistryABI,
    provider
  );
  return identityRegistry.hasIdentity(user);
}

/* ============================================================
   LEGAL REGISTRY FUNCTIONS
============================================================ */

export async function requestAsset(privateKey, jurisdiction, documentURI) {
  const { legalRegistry } = getContracts(privateKey);
  try {
    const tx = await legalRegistry.requestAsset(jurisdiction, documentURI);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map(l => {
        try {
          return legalRegistry.interface.parseLog(l);
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

export async function getTotalAssets() {
  const legalRegistry = new ethers.Contract(
    ADDRESSES.LegalRegistry,
    LegalRegistryABI,
    provider
  );
  return legalRegistry.getTotalAssets();
}

/* ============================================================
   RWA MANAGER FUNCTIONS
============================================================ */

export async function getRWAToken(assetId) {
  const rwaManager = new ethers.Contract(
    ADDRESSES.RWAManager,
    RWAManagerABI,
    provider
  );
  return rwaManager.rwaByAsset(assetId);
}

export async function createRWA(privateKey, params) {
  const { rwaManager } = getContracts(privateKey);

  try {
    const tx = await rwaManager.createRWA(params);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    throw decodeError(err, [
      "error IdentityRequired(address)",
      "error InvalidDistribution()",
      "error ZeroAddress()",
    ]);
  }
}
