import { render, hydrate } from "./lib";
import App from "./components/App";
import context from "../config";

if (context.serverSideRendering) {
  hydrate([App], document.querySelector("#app"), context);
} else {
  Promise.all([
    import("bulma/css/bulma.css"),
    import("./assets/style.css"),
    import("./assets/logo.svg"),
  ]).then(([, , { default: url }]) => {
    context.logoUrl = url;
    render([App], document.querySelector("#app"), context);
  });
}
