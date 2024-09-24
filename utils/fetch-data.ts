import {
  fetchBalance,
  fetchHolderAddy,
  fetchHolderState,
  hasEnoughApproved,
  isGameInProgress,
} from "./on-chain-data.js";
import { config } from "dotenv";

config();

export const getBalance = async (address: string) => {
  try {
    return await fetchBalance(address);
  } catch (error) {
    throw new Error("Error fetching balance");
  }
};

export const getGameState = async () => {
  try {
    const [holderAddy, contractBalance, gameInProgress] = await Promise.all([
      fetchHolderAddy(),
      fetchBalance(process.env.YOINK_ADDRESS as string),
      isGameInProgress(),
    ]);
    return { holderAddy, contractBalance, gameInProgress };
  } catch (error) {
    throw new Error("Error fetching holder state");
  }
};

export const getHolderState = async (walletAddress: string) => {
  try {
    const [holderState, contractBalance, userBalance, sufficientApproval] =
      await Promise.all([
        fetchHolderState(),
        fetchBalance(process.env.YOINK_ADDRESS as string),
        fetchBalance(walletAddress),
        hasEnoughApproved(walletAddress),
      ]);
    return { holderState, contractBalance, userBalance, sufficientApproval };
  } catch (error) {
    throw new Error("Error fetching holder state");
  }
};
