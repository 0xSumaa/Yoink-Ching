import { BigNumber } from "ethers";
import { formatBalance } from "../utils/format.js";

type ApprovedMessageProps = {
  userBalance: BigNumber;
  contractBalance: BigNumber;
};

function YoinkMessage({ contractBalance, userBalance }: ApprovedMessageProps) {
  return (
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
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "black",
          display: "flex",
          fontSize: 24,
          fontStyle: "normal",
          letterSpacing: "-0.025em",
          lineHeight: 1.4,
        }}
      >
        balance: {formatBalance(userBalance)} MOXIE
      </div>
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
        Approved, Now Yoink!
      </div>
      <div
        style={{
          color: "black",
          fontSize: 36,
          fontStyle: "normal",
          display: "flex",
          letterSpacing: "-0.025em",
          lineHeight: 1.4,
          padding: "0 120px",
          whiteSpace: "pre-wrap",
        }}
      >
        yoink and hodl for 24 hours to win {formatBalance(contractBalance)}{" "}
        MOXIE
      </div>
    </div>
  );
}

export default YoinkMessage;
