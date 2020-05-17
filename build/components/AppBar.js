"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Bar = _css.default.div`
  grid-area: a;
  padding: 2px 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--light-gray);
`;
const Button = _css.default.button`
  --size: 48px;
  border: none;
  width: var(--size);
  height: var(--size);
  border-radius: calc(0.5 * var(--size));
  margin: 5px;
  background: none;
  outline: none;
  cursor: pointer;
`.and`:hover {
    background: var(--light-gray);
  }
`;
const Group = _css.default.div`
  flex: 0 0 auto;
  min-width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
`;
const Logo = _css.default.img`
  height: 40px;
`;
const Icon = _css.default.i`
  font-size: 1rem;
  color: var(--dark-gray);
`;
const Input = _css.default.input`
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 1rem;
`;
const SearchBar = _css.default.div`
  width: 50vw;
  height: calc(100% - 20px);
  padding: 5px;
  background: var(--light-gray);
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
`.and`:focus-within {
    box-shadow: 0 1px 4px 0px var(--gray);
    background: white;
  }
`;
const SearchIcon = _css.default.i`
  font-size: 1rem;
  color: var(--dark-gray);
  margin: 20px;
`;

const AppBar = () => ({
  toggle
}) => // use transform
[[Bar, {}, [[Group, {}, [[Button, {
  onclick: toggle
}, [[Icon, {
  className: "fas fa-bars"
}, []]]], [Logo, {
  src: "assets/logo.png",
  alt: "logo"
}, []]]], [SearchBar, {}, [[SearchIcon, {
  className: "fas fa-search"
}, []], [Input, {
  placeholder: "Search mail"
}, []]]], [Group, {}, []]]]];

var _default = AppBar;
exports.default = _default;