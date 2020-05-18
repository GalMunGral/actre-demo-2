import { render, hydrate } from "./lib/browser";
import App from "./components/App";
// import "@fortawesome/fontawesome-free/css/all.css";

// render([App], document.querySelector("#app"), {});

hydrate([App], document.querySelector("#app"), {});
