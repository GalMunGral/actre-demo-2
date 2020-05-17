"use strict";

var _engine = require("./lib/engine");

var _App = _interopRequireDefault(require("./components/App"));

require("./index.css");

require("@fortawesome/fontawesome-free/css/all.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _engine.render)([_App.default], document.querySelector("#app"), {});