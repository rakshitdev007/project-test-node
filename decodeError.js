import { ethers } from "ethers";

/* ============================================================
   CORRECT ERROR ABI (MATCHES CONTRACTS)
============================================================ */

const ERROR_ABI = [
  // RWAManager
  "error ZeroAddress()",
  "error AssetNotApproved()",
  "error AlreadyTokenized()",
  "error InvalidDistribution()",
  "error IdentityMissing(address)",
  "error CountryMismatch(address,string,string)",

  // RWAToken
  "error IdentityRequired(address)",
  "error CountryTransferBlocked(address,address,string,string)",

  // LegalRegistry
  "error InvalidStatus()",
  "error NotOwner()",
  "error IdentityNotVerified()",
  "error JurisdictionMismatch()",

  // IdentityRegistry
  "error IdentityAlreadyVerified()",
  "error IdentityDoesNotExist()",
  "error IdentityInvalid(address)",
];

function decodeRevertData(data) {
  const iface = new ethers.Interface(ERROR_ABI);

  try {
    const decoded = iface.parseError(data);
    return {
      name: decoded.name,
      args: decoded.args.map(v =>
        typeof v === "bigint" ? v.toString() : v
      ),
    };
  } catch {
    return { raw: data };
  }
}

/* ============================================================
   TEST
============================================================ */

const revertData =
  "0x118cdaa7000000000000000000000000cf94c9757fb442c972a83a72f7592ba853751fc8";

console.log("DECODED REVERT");
console.log(decodeRevertData(revertData));
