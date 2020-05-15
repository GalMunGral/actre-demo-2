import { render } from "./lib/engine";
import App from "./components/App";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.css";

render([App], document.querySelector("#app"), {});
