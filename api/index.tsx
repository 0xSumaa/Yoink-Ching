import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import MoxieABI from "../constants/erc20abi.json";
import YoinkABI from "../constants/yoinkabi.json";
import { config } from "dotenv";
import { ethers, BigNumber } from "ethers";
import { adjustBalance } from "../utils/format.js";
import { calculateMultiplier } from "../utils/math.js";
import {
  getBalance,
  getGameState,
  getHolderState,
} from "../utils/fetch-data.js";
import { neynar } from "frog/middlewares";
import CoverImage from "../components/cover-image.jsx";
import HolderStateDisplay from "../components/intro-image.jsx";
import RateLimitMessage from "../components/rate-limit-image.jsx";
import YoinkedMessage from "../components/yoinked-image.jsx";
import YoinkMessage from "../components/yoink-image.jsx";
import landingPage from "../components/landing-page.jsx";
import ClaimedImage from "../components/claimed-image.jsx";
import { checkRateLimit } from "../utils/rate-limit.js";

config();

type State = {
  contractBalance: BigNumber;
  userBalance: BigNumber;
};

export const app = new Frog<{ State: State }>({
  initialState: {
    contractBalance: BigNumber.from(0),
    userBalance: BigNumber.from(0),
  },
  assetsPath: "/",
  basePath: "/",
  title: "Yoink-Ching",
  browserLocation: "https://warpcast.com/sumaa",
}).use(
  neynar({
    apiKey: process.env.NEYNAR_FROG_FM as string,
    features: ["interactor"],
  })
);
const hono = app.hono;

hono.get("/", async (c) => {
  return c.html(landingPage);
});

app.frame("/api", async (c) => {
  try {
    const { holderAddy, contractBalance, gameInProgress } =
      await getGameState();
    return c.res({
      image: (
        <CoverImage
          balance={contractBalance}
          gameInProgress={gameInProgress}
          holderAddy={holderAddy}
        />
      ),
      intents: [
        gameInProgress ? (
          <Button action="/intro">🚀 Start</Button>
        ) : (
          <Button.Transaction target="/claim" action="/claimed">
            {" "}
            Claim MOXIE{" "}
          </Button.Transaction>
        ),
      ],
    });
  } catch (error) {
    return c.error({
      message: "Error loading data",
      statusCode: 400,
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
        intents: [<Button action="/api">Go Back</Button>],
      });
    }

    const walletAddress =
      (c.var.interactor?.verifications?.[0] as string) ||
      (c.var.interactor?.custodyAddress as string);
    const { holderState, contractBalance, userBalance, sufficientApproval } =
      await getHolderState(walletAddress);

    c.deriveState((previousState) => {
      previousState.contractBalance = contractBalance;
      previousState.userBalance = userBalance;
    });
    return c.res({
      image: (
        <HolderStateDisplay
          holderAddy={holderState.holder}
          timeHeld={holderState.timeHeld}
          timeLeft={holderState.timeLeft}
          contractBalance={contractBalance}
          userBalance={userBalance}
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
    return c.error({
      message: "Error loading data",
      statusCode: 400,
    });
  }
});

app.frame("/yoink", async (c) => {
  try {
    const { contractBalance, userBalance } = c.previousState;

    return c.res({
      image: (
        <YoinkMessage
          contractBalance={contractBalance}
          userBalance={userBalance}
        />
      ),
      intents: [
        <Button.Transaction target="/yoink-flag" action="/yoinked">
          Yoink for 10 MOXIE 😈
        </Button.Transaction>,
      ],
    });
  } catch (error) {
    return c.error({
      message: "Error Yoinking",
      statusCode: 400,
    });
  }
});

app.frame("/yoinked", async (c) => {
  try {
    const adjustedBalance = adjustBalance(
      await getBalance(process.env.YOINK_ADDRESS as string)
    );
    const multiplier = calculateMultiplier(adjustedBalance.toString(), 10);
    return c.res({
      image: <YoinkedMessage multiplier={multiplier} />,
      intents: [],
    });
  } catch (error) {
    return c.error({
      message: "Yoinked, but error fetching completion screen",
      statusCode: 400,
    });
  }
});

app.frame("/claimed", async (c) => {
  const balance = await getBalance(process.env.YOINK_ADDRESS as string);
  return c.res({
    image: <ClaimedImage balance={balance} />,
    intents: [],
  });
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

app.transaction("/claim", (c) => {
  return c.contract({
    abi: YoinkABI,
    functionName: "yoink",
    args: [],
    chainId: "eip155:11155111",
    to: process.env.YOINK_ADDRESS as `0x${string}`,
    value: BigInt(0),
  });
});

export const GET = handle(app);
export const POST = handle(app);
