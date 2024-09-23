const RateLimitMessage = () => (
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
        fontSize: 48,
        fontStyle: "normal",
        letterSpacing: "-0.025em",
        lineHeight: 1.4,
        padding: "0 120px",
        whiteSpace: "pre-wrap",
      }}
    >
      You are Yoinking too much ser! One yoink every 10 minutes.
    </div>
  </div>
);

export default RateLimitMessage;
