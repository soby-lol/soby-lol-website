export type GetNoneRes = {
    nonce: string | undefined;
};

export interface LoginReq {
    address: string;
    signature: string;
}

export type LoginRes = {
    expired:number;
    token:string;
}

export type TaskCompeleted = {
    message: string;
    tasks: string[];
    is_register_whitelist: boolean;
}

export type SignatureRes = {
    signature:string;
    nonce: string;
}

export type Bundle = {
    id:string;
    round:BigInt;
    poolPrize: BigInt;
    totalDistributed: BigInt;
    totalPlayers: BigInt;
};

export type TicketLeaderboard = {
    id:string;
    owner:String;
    amount: BigInt;
    amountUSD:BigInt;
    probability: BigInt;
    round:BigInt;
}

export type Winner = {
    id:string;
    bonus: BigInt;
    round:BigInt;
    transactionHash:string;
    timestamp: string;
    winner:string;
}

export type Ticket = {
    id:string;
    probability: BigInt;
    user:string;
    amountUSD:BigInt;
    round:BigInt;
}

export type DefinedPairMetadata = {
    pairAddress: string;
    liquidity: string;
    volume24: string;
    volume4: string;
    volume12: string;
    volume1w: string;
}

export const DefinedPairMetadataDefault: DefinedPairMetadata = {
    pairAddress: "",
    liquidity: "0",
    volume24: "0",
    volume4: "0",
    volume12: "0",
    volume1w: "0",
}