import { BigNumber } from "ethers";
import { formatBalance } from "../utils/format.js";

interface HolderStateDisplayProps {
  holder: string;
  timeHeld: string;
  timeLeft: string;
  balance: BigNumber;
}

const HolderStateDisplay = ({
  holder,
  timeHeld,
  timeLeft,
  balance,
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
    }}
  >
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
      {holder} has the flag
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
      {timeLeft} left before winning {formatBalance(balance)} MOXIE
    </div>
  </div>
);

export default HolderStateDisplay;
