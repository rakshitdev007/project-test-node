import { ethers } from "ethers";

/**
 * Keep this ABI in sync with your RWAManager + dependencies
 */
const ERROR_ABI = [
    "error IdentityMissing(address)",
    "error CountryMismatch(address,string,string)",
    "error InvalidDistribution()",
    "error AssetAlreadyExists(uint256)",
    "error ZeroAddress()",
    "error LengthMismatch()"
];

export function decodeRevert(err) {
    const data =
        err?.data ||
        err?.error?.data ||
        err?.info?.error?.data;

    if (!data) {
        return {
            error: "NO_REVERT_DATA",
            original: err
        };
    }

    try {
        const iface = new ethers.Interface(ERROR_ABI);
        const decoded = iface.parseError(data);

        return {
            name: decoded.name,
            args: decoded.args
        };
    } catch {
        return {
            error: "UNKNOWN_REVERT",
            raw: data
        };
    }
}
