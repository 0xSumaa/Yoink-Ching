import { formatBalance } from "../utils/format.js";
import { BigNumber } from "ethers";

export const SuccessImage = ({ balance }: { balance: BigNumber }) => (
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
        fontSize: 124,
        fontStyle: "normal",
        letterSpacing: "-0.025em",
        display: "flex",
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
        display: "flex",
        lineHeight: 1.4,
        marginTop: 10,
        padding: "0 120px",
        whiteSpace: "pre-wrap",
      }}
    >
      yoink and hodl for 24 hours to win {formatBalance(balance)} MOXIE
    </div>
  </div>
);

export const ErrorImage = ({ message }: { message: string }) => (
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
      {message}
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
);
