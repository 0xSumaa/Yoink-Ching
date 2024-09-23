import { ethers, BigNumber } from "ethers";
import { config } from "dotenv";
import MoxieABI from "../constants/erc20abi.json";
import YoinkABI from "../constants/yoinkabi.json";
import { HolderState } from "../types/on-chain-types.js";
import { formatAddress, formatElapsedTime } from "./format.js";
config();

export const hasEnoughApproved = async (address: string): Promise<boolean> => {
  const moxieContract = buildContract(
    process.env.MOXIE_ADDRESS as string,
    MoxieABI
  );

  const approvalAmount = await moxieContract.allowance(
    address,
    process.env.YOINK_ADDRESS as string
  );
  const tenTokens = ethers.utils.parseUnits("10", 18);
  console.log(approvalAmount);
  if (approvalAmount.gte(tenTokens)) {
    return true;
  }

  return false;
};

export const fetchNumberOfYoinks = async (): Promise<string> => {
  const yoinkContract = buildContract(
    process.env.YOINK_ADDRESS as string,
    YoinkABI
  );
  const numOfYoinks: BigNumber = await yoinkContract.numberOfYoinks();
  return numOfYoinks.toString();
};

export const fetchBalance = async (): Promise<BigNumber> => {
  const moxieContract = buildContract(
    process.env.MOXIE_ADDRESS as string,
    MoxieABI
  );

  const balance: BigNumber = await moxieContract.balanceOf(
    process.env.YOINK_ADDRESS as string
  );

  return balance;
};
export const fetchHolderState = async (): Promise<HolderState> => {
  const yoinkContract = buildContract(
    process.env.YOINK_ADDRESS as string,
    YoinkABI
  );

  const holder = await yoinkContract.lastYoinker();
  const lastYoinked: BigNumber = await yoinkContract.lastYoinked();
  const timeHeld = formatElapsedTime(lastYoinked.toNumber());
  const timeLeft = calculateTimeLeft(lastYoinked.toNumber());

  return {
    holder: formatAddress(holder),
    timeHeld,
    timeLeft,
  };
};

const buildProvider = (): ethers.providers.JsonRpcProvider => {
  const rpcUrl = process.env.BASE_RPC_URL;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
};

const buildContract = (address: string, abi: any): ethers.Contract => {
  const provider = buildProvider();
  const contract = new ethers.Contract(address, abi, provider);
  return contract;
};

export const calculateTimeLeft = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const elapsedSeconds = now - timestamp;
  const totalSecondsIn24Hours = 24 * 60 * 60;
  const remainingSeconds = totalSecondsIn24Hours - elapsedSeconds;

  if (remainingSeconds <= 0) {
    return "0 minutes";
  }

  const hours = Math.floor(remainingSeconds / (60 * 60));
  const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);

  let formattedTime = "";
  if (hours > 0) formattedTime += `${hours} hour${hours > 1 ? "s" : ""}`;
  if (hours > 0 && minutes > 0) formattedTime += ", ";
  if (minutes > 0)
    formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (formattedTime === "") formattedTime = "0 minutes";

  return formattedTime;
};
