type YoinkedMessageProps = {
  multiplier: string;
};

function YoinkedMessage({ multiplier }: YoinkedMessageProps) {
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
  );
}

export default YoinkedMessage;
