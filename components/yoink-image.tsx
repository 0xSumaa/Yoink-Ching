import { BigNumber } from "ethers";
import { formatBalance } from "../utils/format";

type ApprovedMessageProps = {
  balance: BigNumber;
};

function YoinkMessage({ balance }: ApprovedMessageProps) {
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
        yoink and hodl for 24 hours to win {formatBalance(balance)} MOXIE
      </div>
    </div>
  );
}

export default YoinkMessage;
