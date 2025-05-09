import { APP_NETWORK } from "@/types/common";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { TaskonAddressTestnet } from "./taskon_whitelisted_testnet";
import { TaskonAddressMainnet } from "./taskon_whitelisted_mainnet";

export const TASKON_WHITELIST_ADDRESSES = APP_NETWORK === 'testnet' ? [...TaskonAddressTestnet] : [ ...TaskonAddressMainnet];

// create a Merkle tree
let taskOnMerkleTree : MerkleTree | null = null;


async function createMerkleTreeAsync(addresses: any[]) {
    const leaves = addresses.map((x) =>
        ethers.solidityPackedKeccak256(
            ["address"],
            [x.address]
        )
    );
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    
    return tree;
}

export async function getTaskOnMerkleTree() {
    if (!taskOnMerkleTree) {
        taskOnMerkleTree = await createMerkleTreeAsync(TASKON_WHITELIST_ADDRESSES);
    }
    
    return taskOnMerkleTree;
}