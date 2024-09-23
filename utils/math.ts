import { addCommas } from "./format.js";
export const calculateMultiplier = (
  balance: string,
  amountToPlay: number
): string => {
  const balanceNumber = parseFloat(balance); // Convert balance to a number
  return addCommas((balanceNumber / amountToPlay).toFixed(0)); // Ensure two decimal points
};
