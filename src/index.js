import { render, hydrate } from "./lib/browser";
import App from "./components/App";

render([App], document.querySelector("#app"), {});

// hydrate([App], document.querySelector("#app"), {});
