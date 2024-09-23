import { ethers } from "ethers";
import { config } from "dotenv";
import MoxieABI from "../constants/erc20abi.json";
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
  if (approvalAmount.gte(tenTokens)) {
    return true;
  }
  return false;
};

const buildProvider = (): ethers.providers.JsonRpcProvider => {
  const rpcUrl = process.env.BASE_RPC_URL;
  console.log(`Using RPC URL: ${rpcUrl}`); // Add this line for debugging
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
};

const buildContract = (address: string, abi: any): ethers.Contract => {
  const provider = buildProvider();
  const contract = new ethers.Contract(address, abi, provider);
  return contract;
};
