const { readFileSync } = require("fs");
const express = require("express");
const { renderToString } = require("./build/renderer");
const { default: App } = require("./build/app");

const server = express();

server.get("/", (_, res) => {
  const html = readFileSync("./public/index.html", {
    encoding: "utf8",
  });

  const style = readFileSync("./src/index.css", {
    encoding: "utf8",
  });
  const minifiedStyle = style.replace(
    /(?<=\w)\s+(?=[^\w])|(?<=[^\w])\s+(?=\w)|(?<=[^\w])\s+(?=[^\w])/g,
    ""
  );

  // Server-side Rendering
  const app = renderToString([App], {});
  const parts = html.split(/\/\* css \*\/|<!--app-->/);

  res.send(parts[0] + minifiedStyle + parts[1] + app + parts[2]);
});

server.use(express.static("./public"));

server.listen(8080, () => {
  console.log("Listening");
});
