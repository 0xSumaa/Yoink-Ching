import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import MoxieABI from "../constants/erc20abi.json";
import YoinkABI from "../constants/yoinkabi.json";
import { config } from "dotenv";
import { BigNumber, ethers } from "ethers";
import { adjustBalance } from "../utils/format.js";
import { calculateMultiplier } from "../utils/math.js";
import { getBalance, getHolderState } from "../utils/fetch-data.js";
import { neynar } from "frog/middlewares";
import { SuccessImage } from "../components/cover-image.jsx";
import HolderStateDisplay from "../components/intro-image.jsx";
import RateLimitMessage from "../components/rate-limit-image.jsx";
import YoinkedMessage from "../components/yoinked-image.jsx";
import YoinkMessage from "../components/yoink-image.jsx";
import { checkRateLimit } from "../utils/rate-limit.js";

config();

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  title: "Yoink-Ching",
}).use(
  neynar({
    apiKey: process.env.NEYNAR_FROG_FM as string,
    features: ["interactor"],
  })
);

app.frame("/", async (c) => {
  try {
    const balance = await getBalance();
    return c.res({
      image: <SuccessImage balance={balance} />,
      intents: [<Button action="/intro">🚀 Start</Button>],
    });
  } catch (error) {
    return c.res({
      image: <SuccessImage balance={new BigNumber(0, "0x")} />,
      intents: [],
    });
  }
});

app.frame("/intro", async (c) => {
  try {
    const fid = c.var.interactor?.fid;

    if (!fid) {
      return c.error({
        message: "Error fetching fid",
        statusCode: 400,
      });
    }

    const canProceed = await checkRateLimit(fid.toString());

    if (!canProceed) {
      return c.res({
        image: <RateLimitMessage />,
        intents: [<Button action="/">Go Back</Button>],
      });
    }

    const walletAddress =
      (c.var.interactor?.verifications?.[0] as string) ||
      (c.var.interactor?.custodyAddress as string);
    const { holderState, balance, sufficientApproval } = await getHolderState(
      walletAddress
    );
    return c.res({
      image: (
        <HolderStateDisplay
          holder={holderState.holder}
          timeHeld={holderState.timeHeld}
          timeLeft={holderState.timeLeft}
          balance={balance}
        />
      ),
      intents: [
        sufficientApproval ? (
          <Button.Transaction target="/yoink-flag" action="/yoinked">
            Yoink for 10 MOXIE 😈
          </Button.Transaction>
        ) : (
          <Button.Transaction target="/approve" action="/yoink">
            Approve MOXIE to Yoink
          </Button.Transaction>
        ),
      ],
    });
  } catch (error) {
    return c.res({
      image: <SuccessImage balance={new BigNumber(0, "0x")} />,
      intents: [],
    });
  }
});

app.frame("/yoink", async (c) => {
  try {
    const balance = await getBalance();
    return c.res({
      image: <YoinkMessage balance={balance} />,
      intents: [
        <Button.Transaction target="/yoink-flag" action="/yoinked">
          Yoink for 10 MOXIE 😈
        </Button.Transaction>,
      ],
    });
  } catch (error) {
    return c.res({
      image: <SuccessImage balance={new BigNumber(0, "0x")} />,
      intents: [],
    });
  }
});

app.frame("/yoinked", async (c) => {
  try {
    const adjustedBalance = adjustBalance(await getBalance());
    const multiplier = calculateMultiplier(adjustedBalance.toString(), 10);
    return c.res({
      image: <YoinkedMessage multiplier={multiplier} />,
      intents: [],
    });
  } catch (error) {
    return c.res({
      image: <SuccessImage balance={new BigNumber(0, "0x")} />,
      intents: [],
    });
  }
});

app.transaction("/approve", (c) => {
  return c.contract({
    abi: MoxieABI,
    functionName: "approve",
    args: [
      process.env.YOINK_ADDRESS as `0x${string}`,
      ethers.constants.MaxUint256,
    ],
    chainId: "eip155:11155111",
    to: process.env.MOXIE_ADDRESS as `0x${string}`,
    value: BigInt(0),
  });
});

app.transaction("/yoink-flag", (c) => {
  return c.contract({
    abi: YoinkABI,
    functionName: "yoink",
    args: [],
    chainId: "eip155:11155111",
    to: process.env.YOINK_ADDRESS as `0x${string}`,
    value: BigInt(0),
  });
});

const isProduction = import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
