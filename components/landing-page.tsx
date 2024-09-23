export const landingPage = (
  <html>
    <head>
      <title>Yoink-Ching</title>
      <style>
        {`
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            color: #333;
          }
          h1 {
            font-size: 4em;
            font-weight: bold;
            margin-bottom: 20px;
            color: #ff6347;
            text-shadow: 2px 2px #ffa07a;
          }
          .links-title {
            font-size: 2em;
            margin-bottom: 10px;
            color: #4682b4;
          }
          .links {
            display: flex;
            align-items: center;
            font-size: 1.5em;
          }
          .links a {
            margin: 0 10px;
            color: #007bff;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          .links a:hover {
            color: #0056b3;
            text-decoration: underline;
          }
        `}
      </style>
    </head>
    <body>
      <h1>Yoink-Ching!</h1>
      <div className="links-title">Links</div>
      <div className="links">
        <a href="https://warpcast.com/sumaa">Yoink On Warpcast</a>
        <a href="https://github.com/0xSumaa/Yoink-Ching-Contracts">
          Contracts Github
        </a>
        <a href="https://github.com/0xSumaa/Yoink-Ching">Frame Github</a>
      </div>
    </body>
  </html>
);

export default landingPage;
