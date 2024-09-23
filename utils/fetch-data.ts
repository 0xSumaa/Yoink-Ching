import {
  fetchBalance,
  fetchHolderState,
  hasEnoughApproved,
} from "./on-chain-data.js";

export const getBalance = async () => {
  try {
    return await fetchBalance();
  } catch (error) {
    throw new Error("Error fetching balance");
  }
};

export const getHolderState = async (walletAddress: string) => {
  try {
    const [holderState, balance, sufficientApproval] = await Promise.all([
      fetchHolderState(),
      fetchBalance(),
      hasEnoughApproved(walletAddress),
    ]);
    return { holderState, balance, sufficientApproval };
  } catch (error) {
    throw new Error("Error fetching holder state");
  }
};
