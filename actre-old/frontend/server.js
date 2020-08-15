const { readFileSync } = require("fs");
const { request } = require("http");
const express = require("express");

const { renderToString } = require("./build/lib/HTMLRenderer.js");
const { default: App } = require("./build/components/App.js");
const context = require("./config.js");

const server = express();

server.use("/api", (req, res) => {
  req.pipe(
    request(
      {
        hostname: "localhost",
        port: 8081,
        path: "/api" + req.url,
        method: req.method,
        headers: {
          "content-type": "application/json",
        },
      },
      (response) => {
        res.status(response.statusCode);
        response.pipe(res);
      }
    )
  );
});

server.get("/", (_, res) => {
  const html = readFileSync("./public/index.html", {
    encoding: "utf8",
  });
  const bulma = readFileSync("./node_modules/bulma/css/bulma.min.css", {
    encoding: "utf8",
  });
  const style = readFileSync("./src/assets/style.css", {
    encoding: "utf8",
  });
  const minifiedStyle = style.replace(
    /(?<=\w)\s+(?=[^\w])|(?<=[^\w])\s+(?=\w)|(?<=[^\w])\s+(?=[^\w])/g,
    ""
  );

  // Server-side Rendering
  const app = renderToString([App], context);
  const parts = html.split(/\/\* css \*\/|<!--app-->/);

  res.send(parts[0] + (bulma + minifiedStyle) + parts[1] + app + parts[2]);
});

server.use(express.static("./public"));

server.listen(8080, () => {
  console.log("Listening");
});
