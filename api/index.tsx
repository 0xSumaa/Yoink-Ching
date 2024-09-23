import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import MoxieABI from "../constants/erc20abi.json";
import YoinkABI from "../constants/yoinkabi.json";
import { config } from "dotenv";
import { ethers } from "ethers";
import { neynar } from "frog/middlewares";
import { hasEnoughApproved } from "../utils/on-chain-data.js";
config();

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({
  //   apiKey: process.env.NEYNAR_FROG_FM as string,
  //   features: ["cast", "interactor"],
  // }),
  title: "Yoink-Ching",
});
// }).use(
//   neynar({
//     apiKey: process.env.NEYNAR_FROG_FM as string,
//     features: ["interactor"],
//   })
// );

app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "white",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "red",
            fontSize: 96,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Yoink-Ching!
        </div>
        <div
          style={{
            color: "black",
            fontSize: 36,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 10,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Click to yoink the flag
        </div>
      </div>
    ),
    intents: [<Button action="/start">Yoink</Button>],
  });
});

app.frame("/start", async (c) => {
  // const walletAddress = c.var.interactor?.verifications?.[0];
  const walletAddress = "0x29F0cbED796f0C6663f1ca3F0e3c51De29c78Ec8";
  if (!walletAddress) {
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
              color: "red",
              fontSize: 72,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Need a verified address to yoink
          </div>
        </div>
      ),
      intents: [],
    });
  }

  try {
    const sufficientApproval = await hasEnoughApproved(walletAddress as string);

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
            {sufficientApproval ? "Yoink" : "Approve to Yoink"}
          </div>
          {sufficientApproval && (
            <div
              style={{
                color: "black",
                fontSize: 36,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                marginTop: 20,
                padding: "0 120px",
                whiteSpace: "pre-wrap",
              }}
            >
              Hodling the flag for 24 hours pays out 5000x
            </div>
          )}
        </div>
      ),
      intents: [
        sufficientApproval ? (
          <Button.Transaction target="/yoink-flag" action="/yoinked">
            Yoink
          </Button.Transaction>
        ) : (
          <Button.Transaction target="/approve" action="/approval-done">
            Approve
          </Button.Transaction>
        ),
      ],
    });
  } catch (error) {
    console.error("Error checking approval:", error);
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
              color: "red",
              fontSize: 72,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Error checking approval
          </div>
          <div
            style={{
              color: "black",
              fontSize: 36,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 20,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Please try again
          </div>
        </div>
      ),
      intents: [<Button action="/start">Try Again</Button>],
    });
  }
});

app.frame("/approval-done", (c) => {
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
          Approval Done, Now Yoink!
        </div>
        <div
          style={{
            color: "blue",
            fontSize: 36,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 20,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Holding for 24 hours pays out 5000x
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target="/yoink-flag" action="/yoinked">
        Yoink
      </Button.Transaction>,
    ],
  });
});

app.frame("/yoinked", (c) => {
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
      </div>
    ),
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
// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
