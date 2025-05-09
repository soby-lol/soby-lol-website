import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { ethers } from "ethers";

export const WHITELIST_ADDRESSES = []


const leaves = WHITELIST_ADDRESSES.map((x) =>
  ethers.solidityPackedKeccak256(["address"], [x.address])
);

// create a Merkle tree
export const merkleTree = new MerkleTree(leaves, keccak256, {
  sortPairs: true,
});
