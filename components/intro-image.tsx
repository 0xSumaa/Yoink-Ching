import { BigNumber } from "ethers";
import { formatBalance } from "../utils/format.js";

interface HolderStateDisplayProps {
  holderAddy: string;
  timeHeld: string;
  timeLeft: string;
  contractBalance: BigNumber;
  userBalance: BigNumber;
}

const HolderStateDisplay = ({
  holderAddy,
  timeHeld,
  timeLeft,
  contractBalance,
  userBalance,
}: HolderStateDisplayProps) => (
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
      position: "relative", // Added to position the balance display
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
        fontSize: 64,
        fontStyle: "normal",
        display: "flex",
        letterSpacing: "-0.025em",
        lineHeight: 1.4,
        padding: "0 120px",
        whiteSpace: "pre-wrap",
      }}
    >
      {holderAddy} has the flag
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
      since {timeHeld}
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
      {timeLeft} left before winning {formatBalance(contractBalance)} MOXIE
    </div>
  </div>
);

export default HolderStateDisplay;
