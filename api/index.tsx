import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import MoxieABI from "../constants/erc20abi.json";
import YoinkABI from "../constants/yoinkabi.json";
import { config } from "dotenv";
import { ethers } from "ethers";
import { adjustBalance } from "../utils/format.js";
import { calculateMultiplier } from "../utils/math.js";
import { getBalance, getHolderState } from "../utils/fetch-data.js";
import { formatBalance } from "../utils/format.js";
import { neynar } from "frog/middlewares";
import { SuccessImage } from "../components/cover-image.jsx";
import HolderStateDisplay from "../components/intro-image.jsx";

config();

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  title: "Yoink-Ching",
});
// }).use(
//   neynar({
//     apiKey: process.env.NEYNAR_FROG_FM as string,
//     features: ["interactor"],
//   })
// );

app.frame("/", async (c) => {
  try {
    const balance = await getBalance();
    return c.res({
      image: <SuccessImage balance={balance} />,
      intents: [<Button action="/intro">🚀 Start</Button>],
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
    const walletAddress = "0x29F0cbED796f0C6663f1ca3F0e3c51De29c78Ec8";
    // let walletAddress;
    // walletAddress = c.var.interactor?.verifications?.[0] as string;
    // if (!walletAddress) {
    //   walletAddress = c.var.interactor?.custodyAddress as string;
    // }
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
    return c.error({
      message: "Error loading data",
      statusCode: 400,
    });
  }
});

app.frame("/yoink", async (c) => {
  try {
    const balance = await getBalance();
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "white",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "green",
              fontSize: 72,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Approved, Yoink Away!
          </div>
          <div
            style={{
              color: "black",
              fontSize: 36,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            yoink and hodl for 24 hours to win {formatBalance(balance)} MOXIE
          </div>
        </div>
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
    const adjustedBalance = adjustBalance(await getBalance());
    const multiplier = calculateMultiplier(adjustedBalance.toString(), 10);
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "white",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "green",
              fontSize: 72,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Yoinked!
          </div>
          <div
            style={{
              color: "black",
              fontSize: 36,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              display: "flex",
              lineHeight: 1.4,
              marginTop: 20,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            hodling for 24 hours yields {multiplier}x
          </div>
        </div>
      ),
      intents: [],
    });
  } catch (error) {
    return c.error({
      message: "Yoinked, but error fetching completion screen",
      statusCode: 400,
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
