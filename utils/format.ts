import { ethers, BigNumber } from "ethers";

export const formatAddress = (address: string): string => {
  if (address.length < 8) return address; // Just in case the address is unexpectedly short
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatElapsedTime = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const elapsedSeconds = now - timestamp;

  const days = Math.floor(elapsedSeconds / (24 * 60 * 60));
  const hours = Math.floor((elapsedSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((elapsedSeconds % (60 * 60)) / 60);

  let formattedTime = "";
  if (days > 0) formattedTime += `${days} day${days > 1 ? "s" : ""}, `;
  if (hours > 0) formattedTime += `${hours} hour${hours > 1 ? "s" : ""}`;
  if (hours > 0 && minutes > 0) formattedTime += ", ";
  if (minutes > 0)
    formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (formattedTime === "") formattedTime = "0 minutes ago";
  else formattedTime += " ago";

  return formattedTime;
};

export const formatBalance = (
  balance: BigNumber,
  decimals: number = 18
): string => {
  const formatted = ethers.utils.formatUnits(balance, decimals);
  const integerPart = formatted.split(".")[0]; // Get the integer part only
  return addCommas(integerPart);
};

export const addCommas = (numStr: string): string => {
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const adjustBalance = (
  balance: BigNumber,
  decimals: number = 18
): number => {
  const formatted = ethers.utils.formatUnits(balance, decimals);
  return parseFloat(formatted);
};
